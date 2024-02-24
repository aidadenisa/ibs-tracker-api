import * as supertest from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

import User from '../models/user';
import Record from '../models/record';

import eventService from '../services/events';
import recordService from '../services/records';
import userService from '../services/users';
import testApi from '../utils/testApi';

// @ts-expect-error TS(2792): Cannot find module 'date-fns'. Did you mean to set... Remove this comment to see the full error message
import { format } from 'date-fns';

const api = supertest(app);

const testUser = {
  firstName: 'Test First',
  lastName: 'Test Last',
  email: 'initial@test.com',
  hasMenstruationSupport: true,
};
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const dateInfo = {
  dayYMD: format(new Date(), 'yyyy-MM-dd'),
  timezone: timezone
}

// @ts-expect-error TS(2593): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Records API', () => {

  // @ts-expect-error TS(2593): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /records ', () => {

    let token;
    let selectedEventsIds;
    const date = new Date();

    // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
    beforeAll(async () => {
      // make sure you delete all users and records in the test DB
      await User.deleteMany({});
      await Record.deleteMany({});

      const { otp } = await testApi.signup(testUser);
      token = (await testApi.validateOTP(testUser.email, otp)).token;

      selectedEventsIds = (await eventService.listEvents())
        .filter((event, index) => index < 4)
        .map(event => event.id);

      await api.post('/records/multiple')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateInfo: {
            dayYMD: format(date, 'yyyy-MM-dd'),
            timezone: timezone
          },
          selectedEventsIds: selectedEventsIds
        })
    })

    // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('When the user is logged in and has records, returns an array of records of the current user', async () => {
      await api
        .get('/records')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then((response) => {
          const records = response.body;
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(records.length).toBe(selectedEventsIds.length);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(records.map(record => record.event)).toStrictEqual(selectedEventsIds)

          const lengthOfRecordsOnTheSameDate = records
            .filter(record => record.day === format(date, 'yyyy-MM-dd'));

          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(lengthOfRecordsOnTheSameDate.length).toBe(selectedEventsIds.length)
        })
    })
    // test('result respects the schema', () => { })
  })

  // @ts-expect-error TS(2593): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /records/multiple', () => {
    let token;
    let events;
    let userId;

    const BASE_URL = '/records/multiple';

    // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
    beforeAll(async () => {
      // make sure you delete all users and records in the test DB
      await User.deleteMany({});
      await Record.deleteMany({});

      const { otp, id } = await testApi.signup(testUser);
      userId = id;
      token = (await testApi.validateOTP(testUser.email, otp)).token;

      events = await eventService.listEvents();
    })

    // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('if missing required properties in the body, returns error and status 400', async () => {
      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400)
        .then((response) => {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(response.error).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(response.error.text).toContain('Missing required properties');
        })
      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateInfo: dateInfo,
        })
        .expect(400)
        .then((response) => {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(response.error).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(response.error.text).toContain('Missing required properties');
        })
      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          selectedEventsIds: [],
        })
        .expect(400)
        .then((response) => {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(response.error).toBeDefined();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(response.error.text).toContain('Missing required properties');
        })
    })

    // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('saves records for a specific date', async () => {
      const selectedEventsIds = events.map(event => event.id).filter((event, index) => index % 4 === 0);

      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateInfo,
          selectedEventsIds
        })
        .expect(200)

      const records = await recordService.listRecordsForDate(userId, dateInfo.dayYMD);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(records.length).toBeGreaterThanOrEqual(selectedEventsIds.length);

      const eventsIdsFromRecords = records.map(record => record.event.toString());

      for (let i = 0; i < selectedEventsIds.length; i++) {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(eventsIdsFromRecords).toContain(selectedEventsIds[i])
      }

    })

    // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('overwrites previous records on that date when necessary', async () => {
      const existingEventsIds = events.map(event => event.id).filter((event, index) => index < 4);
      const selectedEventsIds = events.map(event => event.id).filter((event, index) => index % 2 === 0);
      const idsToBeRemoved = existingEventsIds.filter(id => selectedEventsIds.indexOf(id) === -1)

      await recordService.updateRecordsForDate(userId, dateInfo, existingEventsIds);

      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateInfo,
          selectedEventsIds
        })
        .expect(200)

      const recordsAfterUpdate = await recordService.listRecordsForDate(userId, dateInfo.dayYMD);

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(recordsAfterUpdate.length).toBe(selectedEventsIds.length)
      for (let i = 0; i < idsToBeRemoved.length; i++) {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(recordsAfterUpdate).not.toContain(idsToBeRemoved[i])
      }
    })

    // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('saves record ids in the user object', async () => {
      const selectedEventsIds = events.map(event => event.id).filter((event, index) => index % 2 === 0);

      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateInfo,
          selectedEventsIds
        })
        .expect(200)
        .expect(async result => {

          const records = result.body;
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const userInfo = await userService.getUserById(userId);
          const userInfoRecordsIds = userInfo.records.map(record => record._id.toString())

          for (let i = 0; i < records.length; i++) {
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(userInfoRecordsIds).toContain(records[i].id)
          }
        })


    })

    // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
    test('overwrites previous record ids on the user object', async () => {
      const existingEventsIds = events.map(event => event.id).filter((event, index) => index < 4);
      const selectedEventsIds = events.map(event => event.id).filter((event, index) => index % 2 === 0);

      const existingRecords = await recordService.updateRecordsForDate(userId, dateInfo, existingEventsIds);

      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateInfo,
          selectedEventsIds
        })
        .expect(200)

      const recordIdsToBeRemoved = existingRecords.filter(
        record => selectedEventsIds.indexOf(record.event.toString()) === -1
      ).map(record => record.id);

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const userInfo = await userService.getUserById(userId);

      for (let i = 0; i < recordIdsToBeRemoved.length; i++) {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(userInfo.records).not.toContain(recordIdsToBeRemoved[i].id)
      }
    })
  })

  // @ts-expect-error TS(2304): Cannot find name 'afterAll'.
  afterAll(async () => {
    await User.deleteMany({});
    await Record.deleteMany({});
    mongoose.connection.close();
  })
})