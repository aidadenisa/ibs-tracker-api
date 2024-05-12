import { Event } from '@/modules/events/domain/event'
import repo from '@/modules/events/repo/repository'

// const listEvents = async () => {
//   return await Event.find({})
// }

const findEventsByIds = async (eventIds: string[]): Promise<Event[]> => {
  return repo.findEventsByIds(eventIds)
}

export default {
  // listEvents,
  findEventsByIds,
}
