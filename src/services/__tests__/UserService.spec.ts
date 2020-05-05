import request from 'supertest'

import app from '../../app'
import UserModel from '../../models/User'
import UserService from '../UserService'
import { generateAccessToken } from '../../utils/userServiceHelper'

describe('UserService', () => {
  describe('POST /signup create(signupData: AuthenticateData)', () => {
    afterEach(async (done) => {
      await UserModel.deleteOne({ email: 'test@test.com' })
      done()
    })

    test('should return access token if signup success', async (done) => {
      // given
      const user = { email: 'test@test.com', password: 'test1234' }
      // when
      const res = await request(app)
        .post('/user/signup')
        .set('Accept', 'application/json')
        .send(user)
      // then
      expect(res.status).toEqual(201)
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('accessToken')
      expect(res.body.email).toEqual('test@test.com')
      done()
    })

    test('should return 400 error if already exists registered email', async (done) => {
      // given
      const user = { email: 'test@test.com', password: 'test1234' }
      await UserModel.create(user)
      // when
      const res = await request(app)
        .post('/user/signup')
        .set('Accept', 'application/json')
        .send(user)
      // then
      expect(res.status).toEqual(400)
      expect(res.body.fields).toEqual([{
        'email': 'email has already exist'
      }])
      done()
    })

    test('should return 400 error if receive invalid email format', async (done) => {
      // given
      const user = { email: 'test', password: 'test1234' }
      // when
      const res = await request(app)
        .post('/user/signup')
        .set('Accept', 'application/json')
        .send(user)
      // then
      expect(res.status).toEqual(400)
      expect(res.body.fields).toEqual([{
        'email': 'invalid email format'
      }])
      done()
    })
  })

  describe('POST /signin login(signinData: AuthenticateData)', () => {
    beforeAll(async (done) => {
      const userService = new UserService()
      await userService.create({ email: 'test@test.com', password: 'test1234' })
      done()
    })

    test('should return access token if signin success', async (done) => {
      // given
      const user = { email: 'test@test.com', password: 'test1234' }
      // when
      const res = await request(app)
        .post('/user/signin')
        .set('Accept', 'application/json')
        .send(user)
      // then
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('accessToken')
      expect(res.body.email).toEqual('test@test.com')
      done()
    })

    test('should return 401 error if does not exist receive email in database', async (done) => {
      // given
      const user = { email: 'notRegisteredEmail@test.com', password: 'test1234' }
      // when
      const res = await request(app)
        .post('/user/signin')
        .set('Accept', 'application/json')
        .send(user)
      // then
      expect(res.status).toEqual(401)
      expect(res.body.fields).toEqual([{
        'email': 'authenticate error'
      }])
      done()
    })

    test('should return 401 error if receive invalid password', async (done) => {
      // given
      const user = { email: 'test@test.com', password: 'invalidPassword' }
      // when
      const res = await request(app)
        .post('/user/signin')
        .set('Accept', 'application/json')
        .send(user)
      // then
      expect(res.status).toEqual(401)
      expect(res.body.fields).toEqual([{
        'password': 'authenticate error'
      }])
      done()
    })

    afterAll(async (done) => {
      await UserModel.deleteOne({ email: 'test@test.com' })
      done()
    })
  })

  describe('GET /user/profile getProfile()', () => {
    beforeAll(async (done) => {
      const userService = new UserService()
      await userService.create({ email: 'test@test.com', password: 'test1234' })
      done()
    })

    test('should return 403 error if does not exist user in database', async (done) => {
      // given
      const accessToken = generateAccessToken('notExistsEmail@test.com')
      // when
      const res = await request(app)
        .get('/user/profile')
        .set('authorization', accessToken)
      // then
      expect(res.status).toEqual(403)
      done()
    })

    test('should return user profile', async (done) => {
      // given
      const accessToken = generateAccessToken('test@test.com')
      // when
      const res = await request(app)
        .get('/user/profile')
        .set('authorization', accessToken)
      // then
      expect(res.status).toEqual(200)
      expect(res.body.email).toEqual('test@test.com')
      expect(res.body).toHaveProperty('_id')
      expect(res.body).not.toHaveProperty('password')
      done()
    })

    afterAll(async (done) => {
      await UserModel.deleteOne({ email: 'test@test.com' })
      done()
    })
  })
})
