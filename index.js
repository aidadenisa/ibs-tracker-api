import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
// Use JSON interpreter for incoming requests
app.use(express.json());

app.get('/', (request, response) => {
  response.send('working');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})