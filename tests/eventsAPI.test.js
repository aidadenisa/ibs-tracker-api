import mongoose from 'mongoose';
import supertest from 'supertest';

import '../db/connection.js';
import app from '../app.js';

// initialize the API using the supertest framework
// by wrapping it in a superagent object
const api = supertest(app);

test('events are returned as JSON', async () => {
  await api
    .get('/events')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('events list is not empty', async () => {
  const result = await api.get('/events');

  // we use JEST here to test the correctness https://jestjs.io/docs/using-matchers
  expect(result.body).not.toBeUndefined();
  expect(result.body.length).toBeGreaterThan(4);
})

afterAll(() => {
  mongoose.connection.close();
})