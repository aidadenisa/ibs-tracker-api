import cors from 'cors';
import express from 'express';
import { errorHandler } from './utils/middleware.js';
import eventRouter from './controllers/events.js';
import recordRouter from './controllers/records.js';
import userRouter from './controllers/users.js';

//Because of this library, we do not need the next(exception) call anymore when using async/await (in try/catch). 
//The library handles everything under the hood. If an exception occurs in an async route, the execution is automatically passed to the error handling middleware.
import 'express-async-errors';

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
