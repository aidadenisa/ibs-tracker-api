import cors from 'cors'
import express from 'express'
import { authorize } from '@/modules/users/controllers/middleware/authorization'

import eventRouter from '@/modules/events/controllers/handler'
import recordRouter from '@/modules/records/controllers/handler'
import { userRouter, authRouter } from '@/modules/users/controllers/handler'

const app = express()

app.use(cors())

// Use JSON interpreter for incoming requests
app.use(express.json())
// app.use(requestLogger);

app.get('/', async (request, response) => {
  response.send('working')
})

app.use('/auth', authRouter)
app.use('/users', authorize, userRouter)
app.use('/records', authorize, recordRouter)
app.use('/events', authorize, eventRouter)
// Handler for requests with unknown endpoint
// app.use(unknownEndpoint)
// Handler of requests that have errors
// app.use(errorHandler)

export default app
