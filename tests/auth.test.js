import mongoose from 'mongoose';
import User from '../models/user';
import authService from '../services/auth';
import supertest from 'supertest';
import app from '../app';

const api = supertest(app);

describe('auth: user', () => {

  // delete all users and create a dummy initial user
  beforeEach(async () => {
    await User.deleteMany({});
    await authService.signup({
      firstName: 'Test First',
      lastName: 'Test Last',
      pass: '123456',
      email: 'initial@test.com',
      hasMenstruationSupport: true,
    });
  }, 100000);

  test('is not created if the email is not unique', async () => {
    const initialUsers = await User.find({});
    const newUser = {
      firstName: 'Test First',
      lastName: 'Test Last',
      pass: '123456',
      email: 'initial@test.com',
      hasMenstruationSupport: true,
    };
    const result = await api.post('/auth/signup')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.error).toContain('The email address is already in use');

    const usersAfterSaveAttempt = await User.find({});
    expect(usersAfterSaveAttempt).toEqual(initialUsers);
    
  }, 100000)

  test('is created if the email is unique', async () => {
    const initialUsers = await User.find({});
    const newUser = {
      firstName: 'Test First 2',
      lastName: 'Test Last 2',
      pass: '1234567',
      email: 'new@test.com',
      hasMenstruationSupport: false,
    };

    const result = await api.post('/auth/signup')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body).toBeDefined();
    expect(result.body.id).toBeDefined();
    expect(result.body.id).not.toBeNull();
    expect(result.body.email).toEqual(newUser.email);

    const updatedUsers = await User.find({});

    expect(initialUsers.length).toEqual(updatedUsers.length - 1);
    expect(initialUsers.map(user => user.id).join(' ')).not.toContain(result.body.id);
    expect(updatedUsers.map(user => user.id).join(' ')).toContain(result.body.id);

  })
})

afterAll( () => {
  mongoose.connection.close();
})