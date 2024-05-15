import supertest from 'supertest'
import app from '@/app'
import User from '@/modules/users/repo/user'
import { Record } from '@/modules/records/repo/record'
import { Event } from '@/modules/events/domain/event'

import eventService from '@/modules/events/services/events'
import recordService from '@/modules/records/services/records'
import userService from '@/modules/users/services/users'
import testApi from '@/tests_api/utils/testApi'

import { format } from 'date-fns'
import { closeDBConns, connectTestDB } from '@/infra/db/connection'

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
  describe('GET /records ', () => {
    let token: string
    let selectedEventsIds: string[]
    const date = new Date()

    beforeAll(async () => {
      // make sure you delete all users and records in the test DB
      await connectTestDB()
      await User.deleteMany({})
      await Record.deleteMany({})

      const { otp } = await testApi.signup(testUser)
      token = (await testApi.validateOTP(testUser.email, otp)).token

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
    })

    test('When the user is logged in and has records, returns an array of records of the current user', async () => {
      await api
        .get('/records')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then((response) => {
          const records = response.body
          expect(records.length).toBe(selectedEventsIds.length)
          expect(records.map((record) => record.event)).toStrictEqual(selectedEventsIds)

          const lengthOfRecordsOnTheSameDate = records.filter((record) => record.day === format(date, 'yyyy-MM-dd'))

          expect(lengthOfRecordsOnTheSameDate.length).toBe(selectedEventsIds.length)
        })
    })
    // test('result respects the schema', () => { })
  })

  describe('POST /records/multiple', () => {
    let token: string
    let events: Event[]
    let userId: string

    const BASE_URL = '/records/multiple'

    beforeAll(async () => {
      // make sure you delete all users and records in the test DB
      await User.deleteMany({})
      await Record.deleteMany({})

      const { otp, id } = await testApi.signup(testUser)
      userId = id
      token = (await testApi.validateOTP(testUser.email, otp)).token

      const { data, error } = await eventService.listEvents()
      expect(error).toBeNull()

      events = data
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

      const eventsIdsFromRecords = records.map((record) => record.event.toString())

      for (let i = 0; i < selectedEventsIds.length; i++) {
        expect(eventsIdsFromRecords).toContain(selectedEventsIds[i])
      }
    })

    test('overwrites previous records on that date when necessary', async () => {
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
          const userInfo = await userService.getUserById(userId, false)
          const userInfoRecordsIds = userInfo.records.map((record) => record.toString())

          for (let i = 0; i < records.length; i++) {
            expect(userInfoRecordsIds).toContain(records[i].id)
          }
        })
    })

    test('overwrites previous record ids on the user object', async () => {
      const existingEventsIds = events.map((event) => event.id).filter((event, index) => index < 4)
      const selectedEventsIds = events.map((event) => event.id).filter((event, index) => index % 2 === 0)

      const { data: existingRecords, error: err } = await recordService.listRecordsForDate(userId, dateInfo.dayYMD)
      expect(err).toBeNull()
      const recordIdsToBeRemoved = existingRecords
        .filter((record) => selectedEventsIds.indexOf(record.event.toString()) === -1)
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

      const userInfo = await userService.getUserById(userId, false)

      for (let i = 0; i < recordIdsToBeRemoved.length; i++) {
        expect(userInfo.records).not.toContain(recordIdsToBeRemoved[i])
      }
    })
  })

  afterAll(async () => {
    await User.deleteMany({})
    await Record.deleteMany({})
    await closeDBConns()
  })
})
