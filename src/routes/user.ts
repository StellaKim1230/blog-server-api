import { Router } from 'express'
import UserService from '../services/UserService'

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

export default router
