import { compare } from 'bcrypt'
import { verify } from 'jsonwebtoken'

import { validateEmailFormat, hashPassword, generateAccessToken, SECRET } from '../userServiceHelper'

describe('userServiceHelper', () => {
  describe('validateEmailFormat(email: string)', () => {
    test('should return true if receive correctly email', () => {
      expect(validateEmailFormat('test@test.com')).toBe(true)
      expect(validateEmailFormat('test@test.co')).toBe(true)
    })

    test('should return false if receive incorrectly email', () => {
      expect(validateEmailFormat('test@test')).toBe(false)
      expect(validateEmailFormat('test')).toBe(false)
    })
  })

  describe('hashPassword(password: string)', () => {
    test('', async (done) => {
      const plainPassword = 'test1234'
      const hashedPassword = await hashPassword(plainPassword)
      const compareResult = await compare(plainPassword, hashedPassword)

      expect(plainPassword).not.toEqual(hashedPassword)
      expect(compareResult).toBe(true)
      done()
    })
  })
  
  describe('generateAccessToken(email: string)', () => {
    test('should return generated access token', () => {
      const email = 'test@test.com'
      const accessToken = generateAccessToken(email)

      expect((verify(accessToken, SECRET) as any).email).toEqual(email)
    })
  })
})
