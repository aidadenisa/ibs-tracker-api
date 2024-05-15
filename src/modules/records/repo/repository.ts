import { InternalError } from '@/utils/errors'
import { Record as RepoRecord } from '@/modules/records/repo/record'
import { Record } from '@/modules/records/domain/record'
import { Result } from '@/utils/utils'
import mongoose from 'mongoose'

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

const addRecord = async (input: RecordInput): Promise<Result<Record>> => {
  const newRecord = new RepoRecord({
    createdOn: new Date(),
    user: input.userId,
    event: input.eventId,
    timezone: input.timezone,
    day: input.dayYMD,
  })
  try {
    const result = await newRecord.save()

    return {
      data: {
        id: result.id,
        userId: result.user.toString(),
        timezone: result.timezone,
        day: result.day,
        event: {
          id: result.event.toString(),
        },
      } satisfies Record,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: {
        message: `error while adding the record for user id ${input.userId}: ${err.message}`,
      } satisfies InternalError,
    }
  }
}

const listAllRecordsByUserID = async (userId: string): Promise<Result<Record[]>> => {
  try {
    const queryResult = await RepoRecord.find({ user: userId })

    return {
      data: queryResult.map((record) => ({
        id: record.id,
        userId: record.user.toString(),
        day: record.day,
        timezone: record.timezone,
        event: {
          id: record.event.toString(),
        },
      })) satisfies Record[],
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: {
        message: `error while getting all records for user id ${userId}: ${err.message}`,
      } satisfies InternalError,
    }
  }
}

const listRecordsForDateAndUserId = async (userId: string, dayYMD: string): Promise<Result<Record[]>> => {
  try {
    const queryResults = await RepoRecord.find({
      user: userId,
      day: {
        $eq: dayYMD,
      },
    })

    return {
      data: queryResults.map((result) => ({
        id: result.id,
        userId: result.user.toString(),
        timezone: result.timezone,
        day: result.day,
        event: {
          id: result.event.toString(),
        },
      })) satisfies Record[],
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: {
        message: `error while querying records by date for user id ${userId}: ${err}`,
      } satisfies InternalError,
    }
  }
}

const updateRecordsForDate = async (userId: string, dayInput: DayInput, updatedEventsIds: string[]): Promise<null | InternalError> => {
  const session = await mongoose.startSession()

  // TODO: error on transactions https://stackoverflow.com/questions/51461952/mongodb-v4-0-transaction-mongoerror-transaction-numbers-are-only-allowed-on-a
  // session.startTransaction()
  try {
    await RepoRecord.deleteMany({
      user: userId,
      day: {
        $eq: dayInput.dayYMD,
      },
    })
    // .session(session)

    await RepoRecord.insertMany(
      updatedEventsIds.map((eventId) => ({
        day: dayInput.dayYMD,
        timezone: dayInput.timezone,
        createdOn: new Date(),
        event: eventId,
        user: userId,
      }))
      // { session: session }
    )
    // session.commitTransaction()
    // session.endSession()
    return null
  } catch (err) {
    // session.abortTransaction()
    // session.endSession()
    return {
      message: `error while executing update records transaction for user id ${userId}: ${err.message}`,
    } satisfies InternalError
  }
}

const deleteRecord = async (recordId: string): Promise<null | InternalError> => {
  // TODO: REMOVE RECORD ID FROM THE USER COLLECTION
  try {
    await RepoRecord.findByIdAndDelete(recordId)
  } catch (err) {
    return {
      message: `error while deleting record with id ${recordId}: ${err.message}`,
    } satisfies InternalError
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
