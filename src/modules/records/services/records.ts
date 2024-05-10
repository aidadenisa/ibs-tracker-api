import * as mongoose from 'mongoose'
import Record from '@/modules/records/repo/record'
import logger from '@/utils/logger'
import userService from '@/modules/users/services/users'

const createNewRecord = async (record, user) => {
  const newRecord = new Record({
    createdOn: new Date(),
    user: user.id,
    event: record.eventId,
    timezone: record.timezone,
    day: record.dayYMD,
  })
  const result = await newRecord.save()

  await userService.addRecordIdsToUser(result.user, [result._id.toString()])
  return result
}

const listRecordsByUserId = (userId, populate) => {
  if (populate && populate.toLowerCase() === 'true') {
    return Record.find({ user: userId }).populate({
      path: 'event',
    })
  }
  return Record.find({ user: userId })
}

const listRecordsForDate = async (userId, dayYMD) => {
  const result = await Record.find({
    user: userId,
    day: {
      $eq: dayYMD,
    },
  })
  return result
}

const updateRecordProperties = async (recordId, properties) => {
  // Add properties we allow update of. For now it's just the event.
  const updatedProperties = {
    event: properties.eventId,
  }
  // new: true -> Helps in returning the updated object as result
  return await Record.findByIdAndUpdate(recordId, updatedProperties, {
    new: true,
  })
}

const deleteRecord = async (recordId) => {
  // TODO: REMOVE RECORD ID FROM THE USER COLLECTION
  return await Record.findByIdAndDelete(recordId)
}

const updateRecordsForDate = async (userId, dateInfo, selectedEventsIds) => {
  let results
  const _userId = userId

  // TODO: MAKE THIS A TRANSACTION
  await Record.deleteMany({
    user: _userId,
    day: {
      $eq: dateInfo.dayYMD,
    },
  })

  results = await Record.insertMany(
    selectedEventsIds.map((eventId) => ({
      day: dateInfo.dayYMD,
      timezone: dateInfo.timezone,
      createdOn: new Date(),
      event: eventId,
      user: userId,
    })),
    { ordered: true }
  )
  await userService.updateUserRecordIds(userId)

  return results
}

export default {
  createNewRecord,
  listRecordsByUserId,
  updateRecordProperties,
  deleteRecord,
  listRecordsForDate,
  updateRecordsForDate,
}
