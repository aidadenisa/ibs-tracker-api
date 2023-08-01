import jest from 'jest';
import supertest from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';

import Category from '../models/category.js';
import User from '../models/user.js';
import Event from '../models/event.js';
import Record from '../models/record.js';

import authService from '../services/auth.js';
import eventService from '../services/events.js';
import recordService from '../services/records.js';
import userService from '../services/users.js';
import records from '../services/records.js';

const api = supertest(app);

const testUser = {
  firstName: 'Test First',
  lastName: 'Test Last',
  pass: '123456',
  email: 'initial@test.com',
  hasMenstruationSupport: true,
};

describe('Records API', () => {

  describe('GET /records ', () => {

    let token;
    let selectedEventsIds;
    const date = new Date();

    beforeAll(async () => {
      // make sure you delete all users and records in the test DB
      await User.deleteMany({});
      await Record.deleteMany({});

      await authService.signup(testUser);
      token = (await authService.login(testUser.email, testUser.pass)).token;

      selectedEventsIds = (await eventService.listEvents())
        .filter((event, index) => index < 4)
        .map(event => event.id);

      await api.post('/records/multiple')
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateISO: date.toISOString(),
          selectedEventsIds: selectedEventsIds
        })
    })

    test('When the user is logged in and has records, returns an array of records of the current user', async () => {
      await api
        .get('/records')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then((response) => {
          const records = response.body;
          expect(records.length).toBe(selectedEventsIds.length);
          expect(records.map(record => record.event)).toStrictEqual(selectedEventsIds)
          
          const lengthOfRecordsOnTheSameDate = records
            .filter(record => new Date(record.date).toISOString() === date.toISOString());
          
          expect(lengthOfRecordsOnTheSameDate.length).toBe(selectedEventsIds.length)
        })
    })
    // test('result respects the schema', () => { })
  })

  describe('POST /records/multiple', () => {
    let token;
    let events;
    let userId;

    const BASE_URL = '/records/multiple';

    beforeAll(async () => {
      // make sure you delete all users and records in the test DB
      await User.deleteMany({});
      await Record.deleteMany({});

      const userInfo = await authService.signup(testUser);
      userId = userInfo.id;
      token = (await authService.login(testUser.email, testUser.pass)).token;

      events = await eventService.listEvents();
    })

    test('if missing required properties in the body, returns error and status 400', async () => {
      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.error).toBeDefined();
          expect(response.error.text).toContain('Missing required properties');
        })
      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateISO: (new Date()).toISOString(),
        })
        .expect(400)
        .then((response) => {
          expect(response.error).toBeDefined();
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
          expect(response.error).toBeDefined();
          expect(response.error.text).toContain('Missing required properties');
        })
    })

    test('saves records for a specific date', async () => {
      const dateISO = (new Date()).toISOString();
      const selectedEventsIds = events.map(event => event.id).filter((event, index) => index % 4 === 0);

      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateISO,
          selectedEventsIds
        })
        .expect(200)

      const records = await recordService.listRecordsForDate(userId, dateISO);
      expect(records.length).toBeGreaterThanOrEqual(selectedEventsIds.length);

      const eventsIdsFromRecords = records.map(record => record.event.toString());

      for (let i = 0; i < selectedEventsIds.length; i++) {
        expect(eventsIdsFromRecords).toContain(selectedEventsIds[i])
      }

    })

    test('overwrites previous records on that date when necessary', async () => {
      const dateISO = (new Date()).toISOString();
      const existingEventsIds = events.map(event => event.id).filter((event, index) => index < 4);
      const selectedEventsIds = events.map(event => event.id).filter((event, index) => index % 2 === 0);
      const idsToBeRemoved = existingEventsIds.filter(id => selectedEventsIds.indexOf(id) === -1)

      await recordService.updateRecordsForDate(userId, dateISO, existingEventsIds);

      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateISO,
          selectedEventsIds
        })
        .expect(200)

      const recordsAfterUpdate = await recordService.listRecordsForDate(userId, dateISO);

      expect(recordsAfterUpdate.length).toBe(selectedEventsIds.length)
      for (let i = 0; i < idsToBeRemoved.length; i++) {
        expect(recordsAfterUpdate).not.toContain(idsToBeRemoved[i])
      }
    })

    test('saves record ids in the user object', async () => {
      const dateISO = (new Date()).toISOString();
      const selectedEventsIds = events.map(event => event.id).filter((event, index) => index % 2 === 0);

      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateISO,
          selectedEventsIds
        })
        .expect(200)
        .expect(async result => {

          const records = result.body;
          const userInfo = await userService.getUserById(userId);
          const userInfoRecordsIds = userInfo.records.map(record => record._id.toString())

          for (let i = 0; i < records.length; i++) {
            expect(userInfoRecordsIds).toContain(records[i].id)
          }
        })


    })

    test('overwrites previous record ids on the user object', async () => {
      const dateISO = (new Date()).toISOString();
      const existingEventsIds = events.map(event => event.id).filter((event, index) => index < 4);
      const selectedEventsIds = events.map(event => event.id).filter((event, index) => index % 2 === 0);

      const existingRecords = await recordService.updateRecordsForDate(userId, dateISO, existingEventsIds);

      await api
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .send({
          dateISO,
          selectedEventsIds
        })
        .expect(200)

      const recordIdsToBeRemoved = existingRecords.filter(
        record => selectedEventsIds.indexOf(record.event.toString()) === -1
      ).map(record => record.id);

      const userInfo = await userService.getUserById(userId);

      for (let i = 0; i < recordIdsToBeRemoved.length; i++) {
        expect(userInfo.records).not.toContain(recordIdsToBeRemoved[i].id)
      }
    })
  })

  afterAll(async () => {
    await User.deleteMany({});
    await Record.deleteMany({});
    mongoose.connection.close();
  })
})