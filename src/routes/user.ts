import { Router } from 'express'
import UserService from '../services/UserService'
import authenticateMiddleware from '../middlewares/authenticateMiddleware'

const router = Router()

const user = new UserService()

router.post('/signup', async (req, res) => {
  const { result, data } = await user.create(req.body)

  if (result) {
    res.status(201).send(data)
  } else {
    res.status(400).send({ fields: data })
  }
})

router.post('/signin', async (req, res) => {
  const { result, data } = await user.login(req.body)

  if (result) {
    res.send(data)
  } else {
    res.status(401).send({ fields: data })
  }
})

router.get('/profile', authenticateMiddleware, async (req, res) => {
  const userProfile = await user.getProfile(req.user)

  if (userProfile) {
    res.send(userProfile)
  } else {
    res.status(403).send()
  }
})

export default router
