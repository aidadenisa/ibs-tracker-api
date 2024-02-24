import mongoose from 'mongoose';
import * as supertest from 'supertest';
import app from '../app';
import Event from '../models/event';
import User from '../models/user';
import testApi from '../utils/testApi';

// initialize the API using the supertest framework
// by wrapping it in a superagent object
const api = supertest(app);

// @ts-expect-error TS(2593): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('GET /events', () => {

  let token = '';

  // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
  beforeAll(async () => {
    await User.deleteMany({});

    const newTestUser = {
      firstName: 'Test First',
      lastName: 'Test Last',
      email: 'initial@test.com',
      hasMenstruationSupport: true,
    };
    const { otp } = await testApi.signup(newTestUser);
    token = (await testApi.validateOTP(newTestUser.email, otp)).token;
  }, 100000);

  // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('are returned as JSON with status 200', async () => {
    await api
      .get('/events')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('list is not empty', async () => {
    const result = await api
      .get('/events')
      .set('Authorization', `Bearer ${token}`);

    // we use JEST here to test the correctness https://jestjs.io/docs/using-matchers
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.body).not.toBeUndefined();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.body.length).toBeGreaterThan(1);
  }, 100000)

  //test for the structure of the event, to match the schema of mongoose
  // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('respect the schema', async () => {
    const schemaConfig = Object.keys(Event.schema.obj);
    const events = (await api
      .get('/events')
      .set('Authorization', `Bearer ${token}`)
    ).body;
    for (let i = 0; i < events.length; i++) {
      for (let prop in events[i]) {
        if (prop === 'id') {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(events[i].id).not.toBeNull();
        } else {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(schemaConfig.indexOf(prop)).toBeGreaterThan(-1);
        }
      }
    }
  }, 100000)

})

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  await User.deleteMany({});
  mongoose.connection.close();
})