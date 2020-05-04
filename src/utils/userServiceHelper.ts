import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const TOKEN_EXPIRES_IN = '7d'
export const SECRET = 'jsairjsdf%@$Sdfsd'

export const validateEmailFormat = (email: string) => emailRegex.test(email)

export const hashPassword = async (password: string) => await hash(password, 10)

export const generateAccessToken = (email: string) => sign({ email }, SECRET, { expiresIn: TOKEN_EXPIRES_IN})
