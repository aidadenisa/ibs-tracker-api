import { Event } from '@/modules/events/domain/event'
import { Event as EventRepo } from '@/modules/events/repo/event'
import repo from '@/modules/events/repo/repository'

// TODO: move in repo
const listEvents = async () => {
  return await EventRepo.find({})
}

const findEventsByIds = async (eventIds: string[]): Promise<Event[]> => {
  return repo.findEventsByIds(eventIds)
}

export default {
  listEvents,
  findEventsByIds,
}
