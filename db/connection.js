import mongoose from 'mongoose';
import { seedDB } from './seeds.js';
import { MONGODB_URI } from '../utils/config.js';

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  console.log('MONGODB_URI: ---------',MONGODB_URI)
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    })
    console.log('connected to MongoDB');
    
    //Populate DB with seeds
    await seedDB();
  
    return mongoose.connect
  } catch(error) {
    console.log('error connecting to MongoDB:', error.message);
    return;
  };

}

export {
  connectDB
};