import authenticateMiddleware from '../authenticateMiddleware'

import { generateAccessToken } from '../../utils/userServiceHelper'
import UserService from '../../services/UserService'

describe('authenticateMiddleware(req, res, next)', () => {
  test('should next function called once if exist token in header and token has verified', async (done) => {
    // given
    const userServiceMock = jest.spyOn(UserService.prototype, 'getProfile').mockImplementation(async () => {
      return {
        email: 'test@test.com'
      }
    })
    const accessToken = generateAccessToken('test@test.com')
    const req: any = {
      headers: {
        authorization: accessToken,
      }
    }
    const res: any = {}
    const nextSpy = jest.fn()

    // when
    await authenticateMiddleware(req, res, nextSpy)
    // then
    expect(nextSpy).toHaveBeenCalledTimes(1)
    userServiceMock.mockReset()
    done()
  })

  test('should return 403 error if does not exist token in request header', async (done) => {
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
    await authenticateMiddleware(req, res, next)
    //then
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith({ message: 'unauthorized' })
    done()
  })

  test('should return 403 error if does not verified token', async (done) => {
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
    await authenticateMiddleware(req, res, next)
    // then
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith({ message: 'unauthorized' })
    done()
  })

  test('should return 403 error if does not exist user in database', async (done) => {
    // given
    const userServiceMock = jest.spyOn(UserService.prototype, 'getProfile').mockImplementation(async () => {
      return null
    })
    const accessToken = generateAccessToken('notExistEmail@test.com')
    const req: any = {
      headers: {
        authorization: accessToken,
      }
    }
    const res: any = {
      send: jest.fn()
    }
    res.status = jest.fn().mockReturnValue(res)
    const next: any = jest.fn()
    // when
    await authenticateMiddleware(req, res, next)
    // then
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith({ message: 'unauthorized' })
    userServiceMock.mockReset()
    done()
  })
})
