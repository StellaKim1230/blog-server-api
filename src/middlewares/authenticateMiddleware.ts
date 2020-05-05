import { RequestHandler } from 'express'
import { verify } from 'jsonwebtoken'

import { SECRET } from '../utils/userServiceHelper'
import UserService from '../services/UserService'

const authenticateMiddleware: RequestHandler = async (req, res, next) => {
  const token = req.headers['authorization']

  if (!token) {
    return res.status(403).send({ message: 'unauthorized' })
  }

  try {
    const verifyResult: any = verify(token.toString(), SECRET)
    const user = await new UserService().getProfile(verifyResult.email)

    if (!user) {
      return res.status(403).send({ message: 'unauthorized' })
    }

    req.user = user

    next()
  } catch (e) {
    res.status(403).send({ message: 'unauthorized' })
  }
}

export default authenticateMiddleware
