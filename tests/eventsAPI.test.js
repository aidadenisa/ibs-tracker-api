import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import Event from '../models/event.js';
import User from '../models/user.js';
import Category from '../models/category.js';
import authService from '../services/auth.js';
import { seedDB } from '../db/seeds.js';

// initialize the API using the supertest framework
// by wrapping it in a superagent object
const api = supertest(app);

describe('GET /events', () => {

  let token = '';

  beforeAll(async () => {
    await User.deleteMany({});

    const newTestUser = {
      firstName: 'Test First',
      lastName: 'Test Last',
      pass: '123456',
      email: 'initial@test.com',
      hasMenstruationSupport: true,
    };
    await authService.signup(newTestUser);
    token = (await authService.login(newTestUser.email, newTestUser.pass)).token;
  }, 100000);

  test('are returned as JSON with status 200', async () => {
    await api
      .get('/events')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('list is not empty', async () => {
    const result = await api
      .get('/events')
      .set('Authorization', `Bearer ${token}`);

    // we use JEST here to test the correctness https://jestjs.io/docs/using-matchers
    expect(result.body).not.toBeUndefined();
    expect(result.body.length).toBeGreaterThan(1);
  }, 100000)

  //test for the structure of the event, to match the schema of mongoose
  test('respect the schema', async () => {
    const schemaConfig = Object.keys(Event.schema.obj);
    const events = ( await api
        .get('/events')
        .set('Authorization', `Bearer ${token}`)
    ).body;
    for (let i = 0; i < events.length; i++) {
      for (let prop in events[i]) {
        if (prop === 'id') {
          expect(events[i].id).not.toBeNull();
        } else {
          expect(schemaConfig.indexOf(prop)).toBeGreaterThan(-1);
        }
      }
    }
  }, 100000)

})

afterAll(async () => {
  await User.deleteMany({});
  mongoose.connection.close();
})