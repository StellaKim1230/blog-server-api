import { Router } from 'express'
import PostService from '../services/PostService'
import authenticateMiddleware from '../middlewares/authenticateMiddleware'

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

router.post('/', authenticateMiddleware, async (req, res) => {
  const createdPost = await post.create(req.body, req.user)

  if (createdPost) {
    res.status(201).send(createdPost)
  } else {
    res.status(400).send({
      message: 'invalid parameter error',
      fields: Object.keys(req.body).filter(key => !req.body[key]),
    })
  }
})

router.delete('/:id', authenticateMiddleware, async (req, res) => {
  const isDeleted = await post.delete(req.params.id, req.user)

  if (isDeleted) {
    res.status(204).send()
  } else {
    res.status(400).send()
  }
})

export default router
