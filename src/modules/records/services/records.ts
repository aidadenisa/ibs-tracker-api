import { DayInput } from '@/modules/records/repo/repository'
import { Record } from '@/modules/records/domain/record'
import userService from '@/modules/users/services/users'
import eventService from '@/modules/events/services/events'
import repo from '@/modules/records/repo/repository'
import { InternalError } from '@/utils/errors'
import { Event } from '@/modules/events/domain/event'
import { ErrorUnion, Result } from '@/utils/utils'

type RecordInput = {
  eventId: string
  timezone: string
  dayYMD: string
}

const createNewRecord = async (record: RecordInput, userId: string): Promise<Result<Record>> => {
  const { data, error } = await repo.addRecord({
    eventId: record.eventId,
    userId: userId,
    timezone: record.timezone,
    dayYMD: record.dayYMD,
  })
  if (error) {
    return { data: null, error }
  }
  if (data) {
    // TODO: remove the record ids as a dependency from the User DB model
    const error = await userService.updateUserRecordIds(data.userId)
    if (error) {
      return { data: null, error: error }
    }
  }
  return { data, error: null }
}

const listRecordsByUserId = async (userId: string, populate: boolean = false): Promise<Result<Record[]>> => {
  const { data, error } = await repo.listAllRecordsByUserID(userId)
  if (error) {
    return { data: null, error }
  }

  if (data && populate) {
    const eventIds = data.map((record) => record.event.id)
    const { data: events, error: err } = await eventService.findEventsByIds(eventIds)
    if (err) {
      return { data: null, error: err }
    }

    return { data: matchEventsToRecords(data, events), error: null }
  }
  return { data, error: null }
}

const listRecordsForDate = async (userId: string, dayYMD: string): Promise<Result<Record[]>> => {
  const { data, error } = await repo.listRecordsForDateAndUserId(userId, dayYMD)
  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

const deleteRecord = async (recordId: string): Promise<InternalError> => {
  return repo.deleteRecord(recordId)
}

const updateRecordsForDate = async (userId: string, dayInput: DayInput, updatedEventsIds: string[]): Promise<ErrorUnion> => {
  const err = await repo.updateRecordsForDate(userId, dayInput, updatedEventsIds)
  if (err) {
    return err
  }

  return userService.updateUserRecordIds(userId)
}

const matchEventsToRecords = (records: Record[], events: Event[]): Record[] => {
  return records.map((record) => {
    const matchingEvent = events.find((event) => event.id === record.event.id)
    if (!matchingEvent) return

    return {
      ...record,
      event: {
        id: record.event.id,
        name: matchingEvent.name,
        categoryCode: matchingEvent.categoryCode,
        code: matchingEvent.code,
      },
    }
  })
}

export default {
  createNewRecord,
  listRecordsByUserId,
  deleteRecord,
  listRecordsForDate,
  updateRecordsForDate,
}
