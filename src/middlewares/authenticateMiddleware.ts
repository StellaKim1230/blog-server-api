import { RequestHandler } from 'express'
import { verify } from 'jsonwebtoken'

import { SECRET } from '../utils/userServiceHelper'

const authenticateMiddleware: RequestHandler = (req, res, next) => {
  const token = req.headers['Authorization']

  if (!token) {
    return res.status(403).send({ message: 'unauthorized' })
  }

  try {
    verify(token.toString(), SECRET)
  } catch (e) {
    res.status(403).send({ message: 'unauthorized' })
  }

  next()
}

export default authenticateMiddleware
