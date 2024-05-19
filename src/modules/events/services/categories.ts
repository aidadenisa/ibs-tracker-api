import repo from '@/modules/events/repo/repository'
import { Category } from '@/modules/events/domain/category'
import { Result } from '@/utils/utils'

const getCategories = async (populate: boolean): Promise<Result<Category[]>> => {
  const { data: categories, error } = await repo.listCategories()
  if (error) {
    return { data: null, error }
  }

  if (populate) {
    for (let i = 0; i < categories.length; i++) {
      const cateogoryEventIds = categories[i].events.map((e) => e.id)
      const { data: events, error } = await repo.findEventsByIds(cateogoryEventIds)
      if (error) {
        return { data: null, error }
      }

      categories[i].events = events
    }
  }
  return { data: categories, error: null }
}

export default {
  getCategories,
}
