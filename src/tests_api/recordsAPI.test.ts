import supertest from 'supertest'
import app from '@/app'
import { User as UserRecord } from '@/modules/users/repo/user'
import { Record as RepoRecord } from '@/modules/records/repo/record'

import eventService from '@/modules/events/services/events'
import recordService from '@/modules/records/services/records'
import userService from '@/modules/users/services/users'
import testApi from '@/tests_api/utils/testApi'

import { format } from 'date-fns'
import { closeDBConns, connectTestDB } from '@/infra/db/connection'
import { Record } from '@/modules/records/domain/record'

const api = supertest(app)

const testUser = {
  firstName: 'Test First',
  lastName: 'Test Last',
  email: 'initial@test.com',
  hasMenstruationSupport: true,
}
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const dateInfo = {
  dayYMD: format(new Date(), 'yyyy-MM-dd'),
  timezone: timezone,
}

describe('Records API', () => {
  // describe('GET /records ', () => {
  let token: string
  let selectedEventsIds: string[]
  const date = new Date()
  let userId: string

  const BASE_URL = '/records/multiple'

  beforeAll(async () => {
    // make sure you delete all users and records in the test DB
    await connectTestDB()
    await UserRecord.deleteMany({})
    await RepoRecord.deleteMany({})

    const { otp, id } = await testApi.signup(testUser)
    const { data: jwt, error } = await testApi.validateOTP(testUser.email, otp)
    expect(error).toBeNull()

    token = jwt.token
    userId = id
  })

  test('When the user is logged in and has records, returns an array of records of the current user', async () => {
    const { data, error } = await eventService.listEvents()
    expect(error).toBeNull()

    selectedEventsIds = data.filter((event, index) => index < 4).map((event) => event.id)

    await api
      .post('/records/multiple')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dateInfo: {
          dayYMD: format(date, 'yyyy-MM-dd'),
          timezone: timezone,
        },
        selectedEventsIds: selectedEventsIds,
      })

    await api
      .get('/records')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        const records: Record[] = response.body
        expect(records.length).toBe(selectedEventsIds.length)
        expect(records.map((record) => record.event.id)).toStrictEqual(selectedEventsIds)

        const lengthOfRecordsOnTheSameDate = records.filter((record: Record) => record.day === format(date, 'yyyy-MM-dd'))

        expect(lengthOfRecordsOnTheSameDate.length).toBe(selectedEventsIds.length)
      })
  })

  test('if missing required properties in the body, returns error and status 400', async () => {
    await api
      .post(BASE_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.error).toBeDefined()
        expect(response.text).toContain('Missing required properties')
      })
    await api
      .post(BASE_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        dateInfo: dateInfo,
      })
      .expect(400)
      .then((response) => {
        expect(response.error).toBeDefined()
        expect(response.text).toContain('Missing required properties')
      })
    await api
      .post(BASE_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        selectedEventsIds: [],
      })
      .expect(400)
      .then((response) => {
        expect(response.error).toBeDefined()
        expect(response.text).toContain('Missing required properties')
      })
  })

  test('saves records for a specific date', async () => {
    const { data: events, error: err } = await eventService.listEvents()
    expect(err).toBeNull()

    const selectedEventsIds = events.map((event) => event.id).filter((event, index) => index % 4 === 0)

    await api
      .post(BASE_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        dateInfo,
        selectedEventsIds,
      })
      .expect(200)

    const { data: records, error } = await recordService.listRecordsForDate(userId, dateInfo.dayYMD)
    expect(error).toBeNull()
    expect(records.length).toBeGreaterThanOrEqual(selectedEventsIds.length)

    const eventsIdsFromRecords = records.map((record) => record.event.id)

    for (let i = 0; i < selectedEventsIds.length; i++) {
      expect(eventsIdsFromRecords).toContain(selectedEventsIds[i])
    }
  })

  test('overwrites previous records on that date when necessary', async () => {
    const { data: events, error: err } = await eventService.listEvents()
    expect(err).toBeNull()

    const existingEventsIds = events.map((event) => event.id).filter((event, index) => index < 4)
    const selectedEventsIds = events.map((event) => event.id).filter((event, index) => index % 2 === 0)
    const idsToBeRemoved = existingEventsIds.filter((id) => selectedEventsIds.indexOf(id) === -1)

    await recordService.updateRecordsForDate(userId, dateInfo, existingEventsIds)

    await api
      .post(BASE_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        dateInfo,
        selectedEventsIds,
      })
      .expect(200)

    const { data: recordsAfterUpdate, error } = await recordService.listRecordsForDate(userId, dateInfo.dayYMD)
    expect(error).toBeNull()

    expect(recordsAfterUpdate.length).toBe(selectedEventsIds.length)
    for (let i = 0; i < idsToBeRemoved.length; i++) {
      expect(recordsAfterUpdate).not.toContain(idsToBeRemoved[i])
    }
  })

  test('saves record ids in the user object', async () => {
    const { data: events, error: err } = await eventService.listEvents()
    expect(err).toBeNull()

    const selectedEventsIds = events.map((event) => event.id).filter((event, index) => index % 2 === 0)

    await api
      .post(BASE_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        dateInfo,
        selectedEventsIds,
      })
      .expect(200)
      .expect(async (result) => {
        const records = result.body
        const { data: user, error } = await userService.getUserById(userId, false)
        expect(error).toBeNull()

        const userInfoRecordsIds = user.records.map((record) => record.toString())

        for (let i = 0; i < records.length; i++) {
          expect(userInfoRecordsIds).toContain(records[i].id)
        }
      })
  })

  test('overwrites previous record ids on the user object', async () => {
    const { data: events, error: er } = await eventService.listEvents()
    expect(er).toBeNull()

    const existingEventsIds = events.map((event) => event.id).filter((event, index) => index < 4)
    const selectedEventsIds = events.map((event) => event.id).filter((event, index) => index % 2 === 0)

    const { data: existingRecords, error: err } = await recordService.listRecordsForDate(userId, dateInfo.dayYMD)
    expect(err).toBeNull()
    const recordIdsToBeRemoved = existingRecords
      .filter((record) => selectedEventsIds.indexOf(record.event.id) === -1)
      .map((record) => record.id)

    const error = await recordService.updateRecordsForDate(userId, dateInfo, existingEventsIds)
    expect(error).toBeNull()

    await api
      .post(BASE_URL)
      .set('Authorization', `Bearer ${token}`)
      .send({
        dateInfo,
        selectedEventsIds,
      })
      .expect(200)

    const { data: user, error: getUserErr } = await userService.getUserById(userId, false)
    expect(getUserErr).toBeNull()

    for (let i = 0; i < recordIdsToBeRemoved.length; i++) {
      expect(user.records).not.toContain(recordIdsToBeRemoved[i])
    }
  })

  afterAll(async () => {
    await UserRecord.deleteMany({})
    await RepoRecord.deleteMany({})
    await closeDBConns()
  })
})
