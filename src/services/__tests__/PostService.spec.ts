import request from 'supertest'

import app from '../../app'
import PostModel from '../../models/Post'

describe('PostService', () => {
  describe('GET /posts list()', () => {
    test('should return post list', async (done) => {
      const res = await request(app)
        .get('/posts')

        expect(res.status).toEqual(200)
        expect(Array.isArray(res.body)).toBe(true)
        done()
        return res
    })
  })

  describe('GET /posts/:id findById(id: string)' , () => {
    let id: string

    beforeAll(async (done) => {
      const res = await new PostModel({ title: 'test', content: 'test' }).save()
      id = res._id
      done()
      return res
    })

    test('should return one of post document', async (done) => {
      const res = await request(app)
        .get(`/posts/${id}`)
      expect(res.status).toEqual(200)
      expect(res.body.title).toEqual('test')
      expect(res.body.content).toEqual('test')
      done()
      return res
    })

    test('should return 400 error if post documnet not exist', async (done) => {
      const res = await request(app)
        .get('/posts/NOT_EXIST_ID')
      expect(res.status).toEqual(404)
      done()
      return res
    })

    afterAll(async (done) => {
      const res = await PostModel.deleteOne({ _id: id })
      done()
      return res
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
        .send(post)
      // then
      id = res.body._id
      expect(res.status).toEqual(201)
      expect(res.body.title).toEqual('test')
      expect(res.body.content).toEqual('test')
      done()
      return res
    })

    test('should return 400 error if invalid request', async (done) => {
      // given
      const post = { title: 'test', content: '' }
      // when
      const res = await request(app)
        .post('/posts')
        .set('Accept', 'application/json')
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
        .send(post2)
      // then
      expect(res2.status).toEqual(400)
      expect(res2.body.message).toEqual('invalid parameter error')
      expect(res2.body.fields).toEqual(['title', 'content'])

      done()
      return res2
    })

    afterAll(async (done) => {
      const res = await PostModel.deleteOne({ _id: id })
      done()
      return res
    })
  })

  describe('DELETE /posts/:id delete(id: string)', () => {
    test('should delete post document', async (done) => {
      // given
      const { _id } = await new PostModel({ title: 'test', content: 'test' }).save()
      // when
      const res = await request(app)
        .delete(`/posts/${_id}`)
      // then
      expect(res.status).toEqual(204)
      done()
      return res
    })

    test('should return 400 error if not exist post document by id', async (done) => {
      //when
      const res = await request(app)
        .delete('/posts/NOT_EXIST_ID')
      //then
      expect(res.status).toEqual(400)
      done()
      return res
    })
  })
})
