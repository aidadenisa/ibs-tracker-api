import { DayInput } from '@/modules/records/repo/repository'
import { Record } from '@/modules/records/domain/record'
import logger from '@/utils/logger'
import userService from '@/modules/users/services/users'
import eventService from '@/modules/events/services/events'
import repo from '@/modules/records/repo/repository'
import { InternalError } from '@/utils/errors'
import { Event } from '@/modules/events/domain/event'

type RecordInput = {
  eventId: string
  timezone: string
  dayYMD: string
}

const createNewRecord = async (
  record: RecordInput,
  userId: string
): Promise<Record> => {
  const newRecord = await repo.addRecord({
    eventId: record.eventId,
    userId: userId,
    timezone: record.timezone,
    dayYMD: record.dayYMD,
  })

  await userService.addRecordIdsToUser(newRecord.userId, [newRecord.id])
  return newRecord
}

const listRecordsByUserId = async (
  userId: string,
  populate: boolean = false
) => {
  let records = await repo.listAllRecordsByUserID(userId)

  if (populate) {
    const eventIds = records.map((record) => record.event.id)
    const events: Event[] = await eventService.findEventsByIds(eventIds)

    records = matchEventsToRecords(records, events)
  }
  return records
}

const listRecordsForDate = async (
  userId: string,
  dayYMD: string
): Promise<Record[]> => {
  return await repo.listRecordsForDateAndUserId(userId, dayYMD)
}

const deleteRecord = async (
  recordId: string
): Promise<null | InternalError> => {
  return repo.deleteRecord(recordId)
}

const updateRecordsForDate = async (
  userId: string,
  dayInput: DayInput,
  updatedEventsIds: string[]
) => {
  await repo.updateRecordsForDate(userId, dayInput, updatedEventsIds)
  await userService.updateUserRecordIds(userId)
}

const matchEventsToRecords = (records: Record[], events: Event[]) => {
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
