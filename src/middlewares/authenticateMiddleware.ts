import { RequestHandler } from 'express'
import { verify } from 'jsonwebtoken'

import { SECRET } from '../utils/userServiceHelper'

const authenticateMiddleware: RequestHandler = (req, res, next) => {
  const token = req.headers['authorization']

  if (!token) {
    return res.status(403).send({ message: 'unauthorized' })
  }

  try {
    const verifyResult: any = verify(token.toString(), SECRET)

    if (typeof verifyResult !== 'string') {
      req.user = verifyResult.email
    }
    next()
  } catch (e) {
    res.status(403).send({ message: 'unauthorized' })
  }
}

export default authenticateMiddleware
