import { compare } from 'bcrypt'

import UserModel, { User } from '../models/User'
import {
  validateEmailFormat,
  hashPassword,
  generateAccessToken,
} from '../utils/userServiceHelper'

const DUPLICATE_KEY = 11000

interface AuthenticateData {
  name: string
  email: string
  password: string
}

export default class UserService {
  public async create(signupData: AuthenticateData) {
    try {
      if (!validateEmailFormat(signupData.email)) {
        return { result: false, data: [{ email: 'invalid email format' }] }
      }

      const hashedPassword = await hashPassword(signupData.password)
      const { _id, name, email } = await UserModel.create({
        name: signupData.name,
        email: signupData.email,
        password: hashedPassword,
      })

      const accessToken = generateAccessToken(email)

      return { result: true, data: { _id, name, email, accessToken } }
    } catch (e) {
      if (e.code === DUPLICATE_KEY) {
        return { result: false, data: [{ email: 'email has already exist' }] }
      }
      return { result: false, data: [e.errmsg] }
    }
  }

  public async login(signinData: AuthenticateData) {
    const user = await UserModel.findOne({ email: signinData.email })

    if (!user) return { result: false, data: [{ email: 'authenticate error' }] }

    const { _id, email, password } = user
    const isAuthenticated = await compare(signinData.password, password)

    if (!isAuthenticated)
      return { result: false, data: [{ password: 'authenticate error' }] }

    const accessToken = generateAccessToken(email)

    return { result: true, data: { _id, email, accessToken } }
  }

  public async getProfile(
    user?: string,
  ): Promise<Pick<User, 'email' | 'id'> | null> {
    return await UserModel.findOne({ email: user }).select(['email', '_id'])
  }
}
