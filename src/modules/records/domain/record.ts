type Record = {
  id: string
  timezone: string
  day: string
  event: Event
  userId: string
}

type Event = {
  id: string
  name?: string
  categoryCode?: string
  code?: string
}

export type { Record, Event }
