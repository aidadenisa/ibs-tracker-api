import mongoose from 'mongoose';
import { seedDB } from '@/db/seeds';
import { MONGODB_URI } from '@/utils/config';
import logger from '@/utils/logger';

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('connected to MongoDB');

    //Populate DB with seeds
    return await seedDB();
  } catch (error) {
    console.log('error connecting to MongoDB');
    logger.error(error);
    return;
  }

}

process.on('exit', function () {
  // Add shutdown logic here.
  mongoose.connection.close();
});

export {
  connectDB
};