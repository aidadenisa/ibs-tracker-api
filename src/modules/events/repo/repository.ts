import { Event as EventRepo } from '@/modules/events/repo/event'
import { Event } from '@/modules/events/domain/event'
import { Result } from '@/utils/utils'
import { InternalError } from '@/utils/errors'
import { Category as CategoryRepo } from '@/modules/events/repo/category'
import { Category } from '@/modules/events/domain/category'

const listEvents = async (): Promise<Result<Event[]>> => {
  try {
    const queryResult = await EventRepo.find({})
    return {
      data: queryResult.map(
        (event): Event => ({
          id: event.id,
          name: event.name,
          categoryCode: event.category_code,
          code: event.code,
        })
      ) satisfies Event[],
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: {
        message: `error while querying events: ${err.message}`,
      } satisfies InternalError,
    }
  }
}
const findEventsByIds = async (eventIds: string[]): Promise<Result<Event[]>> => {
  try {
    const queryResult = await EventRepo.find({ id: { $in: eventIds } })

    return {
      data: queryResult.map(
        (event): Event => ({
          id: event.id,
          name: event.name,
          categoryCode: event.category_code,
          code: event.code,
        })
      ) satisfies Event[],
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: {
        message: `error while querying events by ids: ${err.message}`,
      } satisfies InternalError,
    }
  }
}

const listCategories = async (): Promise<Result<Category[]>> => {
  try {
    const queryResult = await CategoryRepo.find({})

    return {
      data: queryResult.map(
        (c): Category => ({
          id: c.id,
          name: c.name,
          code: c.code,
          events: c.events.map(
            (e) =>
              ({
                id: e.toString(),
              } satisfies Partial<Event>)
          ),
        })
      ) satisfies Category[],
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: {
        message: `error while querying categories: ${err.message}`,
      } satisfies InternalError,
    }
  }
}

export default {
  findEventsByIds,
  listEvents,
  listCategories,
}
