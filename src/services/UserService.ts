import jwt from 'jsonwebtoken'

import UserModel from '../models/User'
import { validateEmailFormat, hashPassword } from '../utils/userServiceHelper'

const secret = 'jsairjsdf%@$Sdfsd'
const TOKEN_EXPIRES_IN = '7d'
const DUPLICATE_KEY = 11000

interface SignupData {
  email: string
  password: string
}

export default class UserService {
  public async create(signupData: SignupData) {
    try {
      if (!validateEmailFormat(signupData.email)) {
        return { result: false, data: [{ email: 'invalid email format' }]}
      }

      const hashedPassword = await hashPassword(signupData.password)
      const { email } = await UserModel.create({
        email: signupData.email,
        password: hashedPassword,
      })
  
      const accessToken = jwt.sign({ email }, secret, { expiresIn: TOKEN_EXPIRES_IN})

      return { result: true, data: { email, accessToken } }
    } catch (e) {
      if (e.code === DUPLICATE_KEY) {
        return { result: false, data: [{ email: 'email has already exist' }]}
      }
      return { result: false, data: [e.errmsg] }
    }
  }
}
