import { Event as EventRepo } from '@/modules/events/repo/event'
import { Event } from '@/modules/events/domain/event'

const findEventsByIds = async (eventIds: string[]): Promise<Event[]> => {
  const queryResult = await EventRepo.find({ id: { $in: eventIds } })

  return queryResult.map(
    (event): Event => ({
      id: event.id,
      name: event.name,
      categoryCode: event.category_code,
      code: event.code,
    })
  )
}

export default {
  findEventsByIds,
}
