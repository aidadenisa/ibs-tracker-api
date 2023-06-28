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

const api = supertest(app);

// describe('GET /records ', () => {
//   test('returns as JSON with status 200', () => {})
//   test('returns an array of records of the current user', () => {})
//   test('result respects the schema', () => {})
// })

describe('POST /records/multiple', () => {
  let token;
  let events;
  let userId; 

  const BASE_URL = '/records/multiple';
  beforeAll(async () => {
    // make sure you delete all users and records in the test DB
    await User.deleteMany({});
    await Record.deleteMany({});

    const testUser = {
      firstName: 'Test First',
      lastName: 'Test Last',
      pass: '123456',
      email: 'initial@test.com',
      hasMenstruationSupport: true,
    };
    const userInfo = await authService.signup(testUser);
    userId = userInfo.id;
    token = (await authService.login(testUser.email, testUser.pass)).token;

    events = await eventService.listEvents();
  })

  test('returns with status 200', async () => {
    await api
      .post(BASE_URL)
      .send({
        dateISO: (new Date()).toISOString(),
        selectedEventsIds: []
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
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

    for (let i = 0; i < selectedEventsIds.length; i++ ) {
      expect(eventsIdsFromRecords).toContain(selectedEventsIds[i])
    }

  })
  // test('overwrites previous records on that date when necessary', () => {})
  // test('saves record ids in the user object', () => {})
  // test('overwrites previous record ids on the user object', () => {})
})

afterAll(() => {
  mongoose.connection.close();
})