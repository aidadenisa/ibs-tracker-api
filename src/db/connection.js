import mongoose from 'mongoose';
import { seedDB } from './seeds.js';
import { MONGODB_URI } from '../utils/config.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    })
    console.log('connected to MongoDB');
    
    //Populate DB with seeds
    return await seedDB();
  } catch(error) {
    console.log('error connecting to MongoDB');
    logger.error(error);
    return;
  };

}

process.on('exit', function() {
  // Add shutdown logic here.
  mongoose.connection.close();
});

export {
  connectDB
};