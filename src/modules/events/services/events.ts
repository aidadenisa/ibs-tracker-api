import { Event } from '@/modules/events/domain/event'
import { Event as EventRepo } from '@/modules/events/repo/event'
import repo from '@/modules/events/repo/repository'
import { Result } from '@/utils/utils'

const listEvents = async (): Promise<Result<Event[]>> => {
  return await repo.listEvents()
}

const findEventsByIds = async (eventIds: string[]): Promise<Result<Event[]>> => {
  return await repo.findEventsByIds(eventIds)
}

export default {
  listEvents,
  findEventsByIds,
}
