import mongoose from 'mongoose';
import User from '../models/user';
import authService from '../services/auth';
import * as supertest from 'supertest';
import app from '../app';

const api = supertest(app);

const testUser = {
  firstName: 'Test First',
  lastName: 'Test Last',
  email: 'initial@test.com',
  hasMenstruationSupport: true,
};

// @ts-expect-error TS(2593): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('auth: user', () => {

  // delete users with the test email and signup new user with the test data
  // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
  beforeAll(async () => {
    await User.deleteMany({});
    await authService.signup(testUser);
  }, 100000);

  // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('is not created if the email is not unique', async () => {
    const initialUsers = await User.find({});
    const newUser = {
      firstName: 'Test First',
      lastName: 'Test Last',
      email: 'initial@test.com',
      hasMenstruationSupport: true,
    };
    const result = await api.post('/auth/signup')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.body.error).toContain('The email address is already in use');

    const usersAfterSaveAttempt = await User.find({});
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(usersAfterSaveAttempt).toEqual(initialUsers);

  }, 100000)

  // @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('is created if the email is unique', async () => {
    //Arange
    const initialUsers = await User.find({});
    const newUser = {
      firstName: 'Test First 2',
      lastName: 'Test Last 2',
      email: 'new@test.com',
      hasMenstruationSupport: false,
    };

    //Act
    const result = await api.post('/auth/signup')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    //Asses
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.body).toBeDefined();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.body.id).toBeDefined();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.body.id).not.toBeNull();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(result.body.email).toEqual(newUser.email);

    const updatedUsers = await User.find({});

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(initialUsers.length).toEqual(updatedUsers.length - 1);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(initialUsers.map(user => user.id).join(' ')).not.toContain(result.body.id);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(updatedUsers.map(user => user.id).join(' ')).toContain(result.body.id);

    //Teardown
    await User.deleteOne({ email: 'new@test.com' });
  })
})

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(async () => {
  await User.deleteMany({});
  mongoose.connection.close();
})