import request from 'supertest'

import app from '../../app'
import PostModel from '../../models/Post'
import UserModel from '../../models/User'
import UserService from '../UserService'
import { generateAccessToken } from '../../utils/userServiceHelper'

describe('PostService', () => {
  const accessToken = generateAccessToken('test@test.com')

  beforeAll(async (done) => {
    const userService = new UserService()
    await userService.create({ email: 'test@test.com', password: 'test1234' })
    await userService.create({ email: 'differentEmail@test.com', password: 'test1234' })
    done()
  })

  describe('GET /posts list()', () => {
    test('should return post list', async (done) => {
      const res = await request(app)
        .get('/posts')

        expect(res.status).toEqual(200)
        expect(Array.isArray(res.body)).toBe(true)
        done()
    })
  })

  describe('GET /posts/:id findById(id: string)' , () => {
    let id: string

    beforeAll(async (done) => {
      const res = await new PostModel({ title: 'test', content: 'test' }).save()
      id = res._id
      done()
    })

    test('should return one of post document', async (done) => {
      const res = await request(app)
        .get(`/posts/${id}`)
      expect(res.status).toEqual(200)
      expect(res.body.title).toEqual('test')
      expect(res.body.content).toEqual('test')
      done()
    })

    test('should return 400 error if post documnet not exist', async (done) => {
      const res = await request(app)
        .get('/posts/NOT_EXIST_ID')
      expect(res.status).toEqual(404)
      done()
    })

    afterAll(async (done) => {
      await PostModel.deleteOne({ _id: id })
      done()
    })
  })

  describe('POST /posts create(post: PostInput)', () => {
    let id: string

    test('should create new post document', async (done) => {
      // given
      const post = { title: 'test', content: 'test' }
      // when
      const res = await request(app)
        .post('/posts')
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
        .send(post)
      // then
      id = res.body._id
      expect(res.status).toEqual(201)
      expect(res.body.title).toEqual('test')
      expect(res.body.author.email).toEqual('test@test.com')
      expect(res.body.author).not.toHaveProperty('password')
      expect(res.body.content).toEqual('test')
      done()
    })

    test('should return 400 error if invalid request', async (done) => {
      // given
      const post = { title: 'test', content: '' }
      // when
      const res = await request(app)
        .post('/posts')
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
        .send(post)
      // then
      expect(res.status).toEqual(400)
      expect(res.body.message).toEqual('invalid parameter error')
      expect(res.body.fields).toEqual(['content'])

      // given
      const post1 = { title: '', content: 'test' }
      // when
      const res1 = await request(app)
        .post('/posts')
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
        .send(post1)
      // then
      expect(res1.status).toEqual(400)
      expect(res1.body.message).toEqual('invalid parameter error')
      expect(res1.body.fields).toEqual(['title'])

      // given
      const post2 = { title: '', content: '' }
      // when
      const res2 = await request(app)
        .post('/posts')
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
        .send(post2)
      // then
      expect(res2.status).toEqual(400)
      expect(res2.body.message).toEqual('invalid parameter error')
      expect(res2.body.fields).toEqual(['title', 'content'])

      done()
    })

    test('should 403 error if does not exist access token', async (done) => {
      // given
      const post = { title: 'test', content: 'test' }
      // when
      const res = await request(app)
        .post('/posts')
        .set('Accept', 'application/json')
        .send(post)
      // then
      expect(res.status).toEqual(403)
      done()
    })

    afterAll(async (done) => {
      await PostModel.deleteOne({ _id: id })
      done()
    })
  })

  describe('DELETE /posts/:id delete(id: string)', () => {
    let postId: string

    beforeEach(async (done) => {
      const post = { title: 'test', content: 'test' }
      const res = await request(app)
        .post('/posts')
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
        .send(post)
      postId = res.body._id
      done()
    })

    test('should delete post document success', async (done) => {
      // given
      // when
      const res = await request(app)
        .delete(`/posts/${postId}`)
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
      // then
      expect(res.status).toEqual(204)
      done()
    })

    test('should return 400 error if not exist post document by id', async (done) => {
      // when
      const res = await request(app)
        .delete('/posts/NOT_EXIST_ID')
        .set('Accept', 'application/json')
        .set('authorization', accessToken)
      // then
      expect(res.status).toEqual(400)
      done()
    })

    test('should return 400 error if different with author id in post and author id', async (done) => {
      // given
      const token = generateAccessToken('differentEmail@test.com')
      // when
      const res = await request(app)
        .delete(`/posts/${postId}`)
        .set('Accept', 'application/json')
        .set('authorization', token)
      // then
      expect(res.status).toEqual(400)
      done()
    })

    afterEach(async (done) => {
      await PostModel.deleteOne({ title: 'test' })
      done()
    })
  })

  afterAll(async (done) => {
    await UserModel.deleteOne({ email: 'test@test.com' })
    await UserModel.deleteOne({ email: 'differentEmail@test.com' })
    done()
  })
})
