import mongoose from 'mongoose';
import seedDB from './seeds.js';
import { MONGODB_URI } from '../utils/config.js';

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