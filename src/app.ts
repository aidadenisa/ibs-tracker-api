import cors from 'cors'
import express from 'express'
import { errorHandler } from '@/infra/middleware/middleware'
import { authorize } from '@/modules/users/controllers/middleware/authorization'

import eventRouter from '@/modules/events/controllers/handler'
import recordRouter from '@/modules/records/controllers/handler'
import userRouter from '@/modules/users/controllers/users'
import authRouter from '@/modules/users/controllers/auth'

const app = express()

app.use(cors())

// Use JSON interpreter for incoming requests
app.use(express.json())
// app.use(requestLogger);

app.get('/', async (request, response) => {
  response.send('working')
})

app.use('/auth', authRouter)
app.use('/records', authorize, recordRouter)
app.use('/users', authorize, userRouter)
app.use('/events', authorize, eventRouter)
// Handler for requests with unknown endpoint
// app.use(unknownEndpoint)
// Handler of requests that have errors
app.use(errorHandler)

export default app
