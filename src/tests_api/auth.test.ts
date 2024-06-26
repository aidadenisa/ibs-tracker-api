import * as mongoose from 'mongoose'
import supertest from 'supertest'
import { User as UserRepo } from '@/modules/users/repo/user'
import authService from '@/modules/users/services/auth'
import app from '@/app'
import { closeDBConns, connectTestDB } from '@/infra/db/connection'

const api = supertest(app)

const testUser = {
  firstName: 'Test First',
  lastName: 'Test Last',
  email: 'initial@test.com',
  hasMenstruationSupport: true,
}

describe('auth: user', () => {
  // delete users with the test email and signup new user with the test data
  beforeAll(async () => {
    await connectTestDB()
    await UserRepo.deleteMany({})
    await authService.signup(testUser)
  }, 100000)

  test('is not created if the email is not unique', async () => {
    const initialUsers = await UserRepo.find({})
    const newUser = {
      firstName: 'Test First',
      lastName: 'Test Last',
      email: 'initial@test.com',
      hasMenstruationSupport: true,
    }
    const result = await api
      .post('/auth/signup')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toBe(
      'Invalid signup: error while creating new user with email initial@test.com: the email address is already in use.'
    )

    const usersAfterSaveAttempt = await UserRepo.find({})
    expect(usersAfterSaveAttempt).toEqual(initialUsers)
  }, 100000)

  test('is created if the email is unique', async () => {
    //Arange
    const initialUsers = await UserRepo.find({})
    const newUser = {
      firstName: 'Test First 2',
      lastName: 'Test Last 2',
      email: 'new@test.com',
      hasMenstruationSupport: false,
    }

    //Act
    const result = await api
      .post('/auth/signup')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //Asses
    expect(result.body).toBeDefined()
    expect(result.body.id).toBeDefined()
    expect(result.body.id).not.toBeNull()
    expect(result.body.email).toEqual(newUser.email)

    const updatedUsers = await UserRepo.find({})

    expect(initialUsers.length).toEqual(updatedUsers.length - 1)
    expect(initialUsers.map((user) => user.id).join(' ')).not.toContain(result.body.id)
    expect(updatedUsers.map((user) => user.id).join(' ')).toContain(result.body.id)

    //Teardown
    await UserRepo.deleteOne({ email: 'new@test.com' })
  })

  afterAll(async () => {
    await UserRepo.deleteMany({})
    await closeDBConns()
  })
})
