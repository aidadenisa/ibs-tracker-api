import supertest from 'supertest'
import app from '@/app'
import { User as UserRepo } from '@/modules/users/repo/user'
import testApi from '@/tests_api/utils/testApi'
import { closeDBConns, connectTestDB } from '@/infra/db/connection'
import { Event as DomainEvent } from '@/modules/events/domain/event'

// initialize the API using the supertest framework
// by wrapping it in a superagent object
const api = supertest(app)

describe('GET /events', () => {
  let token = ''

  beforeAll(async () => {
    await connectTestDB()
    await UserRepo.deleteMany({})

    const newTestUser = {
      firstName: 'Test First',
      lastName: 'Test Last',
      email: 'initial@test.com',
      hasMenstruationSupport: true,
    }
    const { otp } = await testApi.signup(newTestUser)
    const { data: jwt, error } = await testApi.validateOTP(newTestUser.email, otp)
    expect(error).toBeNull()

    token = jwt.token
  }, 100000)

  test('are returned as JSON with status 200', async () => {
    await api
      .get('/events')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('list is not empty', async () => {
    const result = await api.get('/events').set('Authorization', `Bearer ${token}`)
    expect(result.body).not.toBeUndefined()
    expect(result.body.length).toBeGreaterThan(1)
  }, 100000)

  test('respect the schema', async () => {
    const res = (await api.get('/events').set('Authorization', `Bearer ${token}`)).body
    expect(res).toBeDefined()
    expect(Object.keys(res[0])).toEqual(['id', 'name', 'categoryCode', 'code'])
  }, 100000)

  afterAll(async () => {
    await UserRepo.deleteMany({})
    await closeDBConns()
  })
})
