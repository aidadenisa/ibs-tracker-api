import { Event } from '@/modules/events/domain/event'

type Category = {
  id: string
  code: string
  name: string
  events: Partial<Event>[]
}

export type { Category }
