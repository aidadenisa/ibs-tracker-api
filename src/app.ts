import { connectDB } from './db/connection.js';
// @ts-expect-error TS(2792): Cannot find module 'cors'. Did you mean to set the... Remove this comment to see the full error message
import cors from 'cors';
// @ts-expect-error TS(2792): Cannot find module 'express'. Did you mean to set ... Remove this comment to see the full error message
import express from 'express';
import { errorHandler } from './middleware/middleware.js';
import { authorize } from './middleware/authorization.js';
// @ts-expect-error TS(2792): Cannot find module './src/controllers/events.js'. ... Remove this comment to see the full error message
import eventRouter from './src/controllers/events.js';
// @ts-expect-error TS(2792): Cannot find module './src/controllers/records.js'.... Remove this comment to see the full error message
import recordRouter from './src/controllers/records.js';
// @ts-expect-error TS(2792): Cannot find module './src/controllers/users.js'. D... Remove this comment to see the full error message
import userRouter from './src/controllers/users.js';
// @ts-expect-error TS(2792): Cannot find module './src/controllers/auth.js'. Di... Remove this comment to see the full error message
import authRouter from './src/controllers/auth.js';
// @ts-expect-error TS(2792): Cannot find module './src/controllers/categories.j... Remove this comment to see the full error message
import categoriesRouter from './src/controllers/categories.js';

// @ts-expect-error TS(1378): Top-level 'await' expressions are only allowed whe... Remove this comment to see the full error message
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
