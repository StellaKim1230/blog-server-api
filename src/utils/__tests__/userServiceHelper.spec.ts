import { compare } from 'bcrypt'

import { validateEmailFormat, hashPassword } from '../userServiceHelper'

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
    test('', async () => {
      const plainPassword = 'test1234'
      const hashedPassword = await hashPassword(plainPassword)
      const compareResult = await compare(plainPassword, hashedPassword)

      expect(plainPassword).not.toEqual(hashedPassword)
      expect(compareResult).toBe(true)
    })
  })
})
