import express from 'express'
import mongoose from 'mongoose'

import routes from './routes'

mongoose.connect('mongodb://localhost:27017/myblog', {
  useUnifiedTopology: true
})

const db = mongoose.connection

db.once('open', () => {
  console.log('db open')
})

const app = express()
app.use(express.json())
app.use('/', routes)

if (process.env.NODE_ENV !== 'test') {
  app.listen(4000, () => {
    console.log('server start')
  })
}

export default app
