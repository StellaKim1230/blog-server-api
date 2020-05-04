import authenticateMiddleware from '../authenticateMiddleware'

import { generateAccessToken } from '../../utils/userServiceHelper'

describe('authenticateMiddleware', () => {
  describe('authenticateMiddleware(req, res, next)', () => {
    test('should next function called once if exist token in header and token has verified', () => {
      // given
      const accessToken = generateAccessToken('test@test.com')
      const req: any = {
        headers: {
          authorization: accessToken,
        }
      }
      const res: any = {}
      const nextSpy = jest.fn()

      // when
      authenticateMiddleware(req, res, nextSpy)
      // then
      expect(nextSpy).toHaveBeenCalledTimes(1)
    })

    test('should return 403 error if does not exist token in request header', () => {
      // given
      const req: any = {
        headers: {
          authorization: '',
        }
      }
      const res: any = {
        send: jest.fn()
      }
      res.status = jest.fn().mockReturnValue(res)
      const next: any = jest.fn()
      //when
      authenticateMiddleware(req, res, next)
      //then
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.send).toHaveBeenCalledWith({ message: 'unauthorized' })
    })

    test('should return 403 error if does not verified token', () => {
      // given
      const req: any = {
        headers: {
          authorization: 'unAutorized token',
        }
      }
      const res: any = {
        send: jest.fn()
      }
      res.status = jest.fn().mockReturnValue(res)
      const next: any = jest.fn()
      // when
      authenticateMiddleware(req, res, next)
      // then
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.send).toHaveBeenCalledWith({ message: 'unauthorized' })
    })
  })
})
