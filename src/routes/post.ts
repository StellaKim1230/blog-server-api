import { Router } from 'express'
import PostService from '../services/PostService'

const router = Router()

const post = new PostService()

router.get('/', async (req, res) => {
  const posts = await post.list()
  res.send(posts)
})

router.get('/:id', async (req, res) => {
  const findedPost = await post.findById(req.params.id)

  if (findedPost) {
    res.send(findedPost)
  } else {
    res.status(404).send()
  }
})

router.post('/', async (req, res) => {
  const createdPost = await post.create(req.body)

  if (createdPost) {
    res.status(201).send(createdPost)
  } else {
    res.status(400).send({
      message: 'invalid parameter error',
      fields: Object.keys(req.body).filter(key => !req.body[key]),
    })
  }
})

router.delete('/:id', async (req, res) => {
  const isDeleted = await post.delete(req.params.id)

  if (isDeleted) {
    res.status(204).send()
  } else {
    res.status(400).send()
  }
})

export default router
