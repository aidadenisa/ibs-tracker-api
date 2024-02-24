import { connectDB } from './db/connection.js';
import cors from 'cors';
import express from 'express';
import { errorHandler } from './middleware/middleware.js';
import { authorize } from './middleware/authorization.js';
import eventRouter from './src/controllers/events.js';
import recordRouter from './src/controllers/records.js';
import userRouter from './src/controllers/users.js';
import authRouter from './src/controllers/auth.js';
import categoriesRouter from './src/controllers/categories.js';

await connectDB();

const app = express();

app.use(cors());

// Use JSON interpreter for incoming requests
app.use(express.json());
// app.use(requestLogger);

app.get('/', async (request, response) => {
  response.send('working');
});

app.use('/auth', authRouter);
app.use('/events', authorize, eventRouter);
app.use('/records', authorize, recordRouter);
app.use('/users', authorize, userRouter);
app.use('/categories', authorize, categoriesRouter);
// Handler for requests with unknown endpoint
// app.use(unknownEndpoint)
// Handler of requests that have errors 
app.use(errorHandler);

export default app;
