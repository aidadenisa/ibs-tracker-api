import * as dotenv from 'dotenv';
import express from 'express';
import db from './db/connection.js';
import { Category } from './db/schemas.js';
import eventRouter from './routes/eventRoutes.js';
import recordRouter from './routes/recordRoutes.js';
import userRouter from './routes/userRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
// Use JSON interpreter for incoming requests
app.use(express.json());

app.get('/', async (request, response) => {

  // const category = new Category({
  //   name: 'Symptoms',
  // });

  // const result = await category.save();

  response.send('working');
});

app.use('/events', eventRouter);
app.use('/records', recordRouter);
app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})