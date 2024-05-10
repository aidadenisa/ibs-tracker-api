import cors from 'cors'
import express from 'express'
import { errorHandler } from '@/middleware/middleware'
import { authorize } from '@/middleware/authorization'

import eventRouter from '@/controllers/events'
import recordRouter from '@/controllers/records'
import userRouter from '@/controllers/users'
import authRouter from '@/controllers/auth'
import categoriesRouter from '@/controllers/categories'

const app = express()

app.use(cors())

// Use JSON interpreter for incoming requests
app.use(express.json())
// app.use(requestLogger);

app.get('/', async (request, response) => {
  response.send('working')
})

app.use('/auth', authRouter)
app.use('/events', authorize, eventRouter)
app.use('/records', authorize, recordRouter)
app.use('/users', authorize, userRouter)
app.use('/categories', authorize, categoriesRouter)
// Handler for requests with unknown endpoint
// app.use(unknownEndpoint)
// Handler of requests that have errors
app.use(errorHandler)

export default app
