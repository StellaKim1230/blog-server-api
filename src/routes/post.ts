import { Router } from 'express'
import PostService from '../services/PostService'

const router = Router()

const post = new PostService()

router.get('/', async (req, res) => {
  const posts = await post.list()
  res.send(posts)
})

router.get('/:id', (req, res) => {
  res.send(post.findById(parseInt(req.params.id, 10)))
})

export default router
