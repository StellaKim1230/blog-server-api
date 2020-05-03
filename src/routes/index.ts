import { Router } from 'express'

import postRouter from './post'
import userRouter from './user'

const rootRouter = Router()

rootRouter.use('/posts', postRouter)
rootRouter.use('/user', userRouter)

export default rootRouter
