import mongoose from 'mongoose';
import Record from '../models/record.js';
import logger from '../utils/logger.js';
import userService from '../services/users.js';
import { endOfDay, startOfDay } from 'date-fns';

const createNewRecord = async (record, user) => {
  const newRecord = new Record({
    createdOn: new Date(),
    user: mongoose.Types.ObjectId(user.id),
    event: mongoose.Types.ObjectId(record.eventId),
    timezone: record.timezone,
    day: record.dayYMD,
  });
  const result = await newRecord.save();

  await userService.addRecordIdsToUser(result.user, [result._id.toString()]);
  logger.info(result);
  return result;
}

const listRecordsByUserId = (userId, populate) => {
  if (populate && populate.toLowerCase() === 'true') {
    return Record.find({ user: userId }).populate({
      path: 'event',
    });
  }
  return Record.find({ user: userId });
}

const listRecordsForDate = async (userId, dayYMD) => {
  const result = await Record.find({
    user: new mongoose.Types.ObjectId(userId),
    day: {
      $eq: dayYMD
    }
  })
  return result
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
  // TODO: REMOVE RECORD ID FROM THE USER COLLECTION
  return await Record.findByIdAndDelete(recordId);
}

const updateRecordsForDate = async (userId, dateInfo, selectedEventsIds) => {
  let results;
  const _userId = new mongoose.Types.ObjectId(userId);

  // TODO: MAKE THIS A TRANSACTION
  await Record.deleteMany({
    user: _userId,
    day: {
      $eq: dateInfo.dayYMD, 
    },
  });

  results = await Record.insertMany(
    selectedEventsIds.map(eventId => ({
      day: dateInfo.dayYMD,
      timezone: dateInfo.timezone,
      createdOn: new Date(),
      event: new mongoose.Types.ObjectId(eventId),
      user: _userId,
    })), { ordered: true }
  );
  await userService.updateUserRecordIds(_userId);

  return results;
}

export default {
  createNewRecord,
  listRecordsByUserId,
  updateRecordProperties,
  deleteRecord,
  listRecordsForDate,
  updateRecordsForDate,
}