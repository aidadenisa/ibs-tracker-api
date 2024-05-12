import { InternalError } from '@/utils/errors'
import { Record as RepoRecord } from '@/modules/records/repo/record'
import { Record } from '@/modules/records/domain/record'

type RecordInput = {
  userId: string
  eventId: string
  timezone: string
  dayYMD: string
}

type DayInput = {
  dayYMD: string
  timezone: string
}

const addRecord = async (input: RecordInput): Promise<Record> => {
  const newRecord = new RepoRecord({
    createdOn: new Date(),
    user: input.userId,
    event: input.eventId,
    timezone: input.timezone,
    day: input.dayYMD,
  })
  const result = await newRecord.save()

  return {
    id: result.id,
    userId: result.user.toString(),
    timezone: result.timezone,
    day: result.day,
    event: {
      id: result.event.toString(),
    },
  } as Record
}

const listAllRecordsByUserID = async (userId: string): Promise<Record[]> => {
  const queryResult = await RepoRecord.find({ user: userId })
  return queryResult.map((record) => ({
    id: record.id,
    userId: record.user.toString(),
    day: record.day,
    timezone: record.timezone,
    event: {
      id: record.event.toString(),
    },
  })) as Record[]
}

const listRecordsForDateAndUserId = async (
  userId: string,
  dayYMD: string
): Promise<Record[]> => {
  const queryResults = await RepoRecord.find({
    user: userId,
    day: {
      $eq: dayYMD,
    },
  })

  return queryResults.map((result) => ({
    id: result.id,
    userId: result.user.toString(),
    timezone: result.timezone,
    day: result.day,
    event: {
      id: result.event.toString(),
    },
  })) as Record[]
}

const updateRecordsForDate = async (
  userId: string,
  dayInput: DayInput,
  updatedEventsIds: string[]
): Promise<void> => {
  // TODO: MAKE THIS A TRANSACTION

  await RepoRecord.deleteMany({
    user: userId,
    day: {
      $eq: dayInput.dayYMD,
    },
  })

  await RepoRecord.insertMany(
    updatedEventsIds.map((eventId) => ({
      day: dayInput.dayYMD,
      timezone: dayInput.timezone,
      createdOn: new Date(),
      event: eventId,
      user: userId,
    }))
  )
}

const deleteRecord = async (
  recordId: string
): Promise<null | InternalError> => {
  // TODO: REMOVE RECORD ID FROM THE USER COLLECTION
  try {
    await RepoRecord.findByIdAndDelete(recordId)
  } catch (err) {
    return {
      message: `error while deleting record with id ${recordId}: ${err.message}`,
    } as InternalError
  }
  return null
}

export default {
  addRecord,
  listAllRecordsByUserID,
  listRecordsForDateAndUserId,
  updateRecordsForDate,
  deleteRecord,
}

export type { DayInput }
