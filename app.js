import { connectDB } from './db/connection.js';
import cors from 'cors';
import express from 'express';
import { errorHandler } from './utils/middleware.js';
import eventRouter from './controllers/events.js';
import recordRouter from './controllers/records.js';
import userRouter from './controllers/users.js';

await connectDB();

const app = express();

app.use(cors());

// Use JSON interpreter for incoming requests
app.use(express.json());
// app.use(requestLogger);

app.get('/', async (request, response) => {
  response.send('working');
});

app.use('/events', eventRouter);
app.use('/records', recordRouter);
app.use('/users', userRouter);

// Handler for requests with unknown endpoint
// app.use(unknownEndpoint)
// Handler of requests that have errors
app.use(errorHandler);

export default app;
