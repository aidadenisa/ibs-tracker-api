import * as dotenv from 'dotenv';
import express from 'express';
import errorHandler from './errors/errorHandler.js';
import eventRouter from './routes/eventRoutes.js';
import recordRouter from './routes/recordRoutes.js';
import userRouter from './routes/userRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
// Use JSON interpreter for incoming requests
app.use(express.json());

app.get('/', async (request, response) => {
  response.send('working');
});

app.use('/events', eventRouter);
app.use('/records', recordRouter);
app.use('/users', userRouter);

// TO DO: handler for requests with unknown endpoint
// app.use(unknownEndpoint)

// Handler of requests that have errors
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})