import request from 'supertest'

import app from '../../app'
import UserModel from '../../models/User'

describe('UserService', () => {
  describe('POST /signup create(signupData: SignupData)', () => {
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
})
