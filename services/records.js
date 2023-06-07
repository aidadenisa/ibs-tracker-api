import mongoose from 'mongoose';
import Record from '../models/record.js';
import logger from '../utils/logger.js';

const createNewRecord = async (record) => {
  const newRecord = new Record({
    date: new Date(),
    user: mongoose.Types.ObjectId(record.userId),
    event: mongoose.Types.ObjectId(record.eventId),
  });

  const result = await newRecord.save();
  logger.info(result);
  return result;
}

const listRecordsByUserId = (userId, populate) => {
  if(!!populate) {
    return Record.find({ user: userId }).populate({
      path: 'event',
      populate: {
          path: 'category', 
          model: 'Category'
      }
    });
  }
  return Record.find({ user: userId });
}

const updateRecordProperties = async (recordId, properties) => {
  // Add properties we allow update of. For now it's just the event. 
  const updatedProperties = {
    event: properties.eventId
  }
  // new: true -> Helps in returning the updated object as result
  return await Record.findByIdAndUpdate(recordId, updatedProperties, { new: true });
}

const deleteRecord = async (recordId) => {
  return await Record.findByIdAndDelete(recordId);
}

export default {
  createNewRecord,
  listRecordsByUserId,
  updateRecordProperties,
  deleteRecord,
}