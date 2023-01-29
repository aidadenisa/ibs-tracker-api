import mongoose from 'mongoose';
import supertest from 'supertest';

import '../db/connection.js';
import app from '../app.js';

// initialize the API using the supertest framework
// by wrapping it in a superagent object
const api = supertest(app);

/** An example of how you can initialize the DB. 
 * In the current case it's not needed because these are seeds.s

import Event from '../models/event.js';
import Category from '../models/category.js';
import { categories, events } from '../db/seeds.js';

beforeAll(async () => {
  // Delete current categories and events in the DB
  // * Important: when we await a Mongoose operation, we need to use .exec()
  await Event.deleteMany({ name: { $exists: true } }).exec();
  await Category.deleteMany({ name: { $exists: true } }).exec();  

  const newCategories = await Category.insertMany(
    categories.map(c => ({ ...c, code: c.name.toUpperCase() }))
  );
  
  for(let key in events) {
    const categoryId = newCategories.find(c => c.code === key)._id.toString();
    const newEvents = events[key].map(e => ({ ...e, category: mongoose.Types.ObjectId(categoryId), code: e.name.toUpperCase() }))
    console.log(newEvents);

    await Event.insertMany(newEvents);
  }
})
*/

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
  expect(result.body.length).toBeGreaterThan(1);
})

afterAll(() => {
  mongoose.connection.close();
})