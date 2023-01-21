import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import seedDB from './seeds.js';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
}).then( () => {
  console.log('connected to MongoDB');
})
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
const db = mongoose.connect;

seedDB();

export default db;