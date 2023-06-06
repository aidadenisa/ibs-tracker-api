import mongoose from 'mongoose';
import supertest from 'supertest';

import '../db/connection.js';
import app from '../app.js';

import Event from '../models/event.js';

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
  
  // * Sometimes, the use of Promise.all might be needed when trying to save multiple entries
  // * const promiseArray = noteObjects.map(note => note.save())
  // * await Promise.all(promiseArray)

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

describe('events', () => {

  test('are returned as JSON with status 200', async () => {
    await api
      .get('/events')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)
  
  test('list is not empty', async () => {
    const result = await api.get('/events');
  
    // we use JEST here to test the correctness https://jestjs.io/docs/using-matchers
    expect(result.body).not.toBeUndefined();
    expect(result.body.length).toBeGreaterThan(1);
  }, 100000)

  //test for the structure of the event, to match the schema of mongoose
  test('respect the schema', async () => {
    const schemaConfig = Object.keys(Event.schema.obj);
    const events = (await api.get('/events')).body;
    for(let i = 0; i < events.length; i++) {
      for( let prop in events[i]) {
        if(prop === 'id') {
          expect(events[i].id).not.toBeNull();
        } else {
          expect(schemaConfig.indexOf(prop)).toBeGreaterThan(-1);
        }
      }
    }
  }, 100000)

})

afterAll(() => {
  mongoose.connection.close();
})