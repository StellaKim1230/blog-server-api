import { Router } from 'express'

import postRouter from './post'

const rootRouter = Router()

rootRouter.use('/posts', postRouter)

export default rootRouter
