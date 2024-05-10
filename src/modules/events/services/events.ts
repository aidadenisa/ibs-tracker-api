import Event from '@/modules/events/repo/event'

const listEvents = async () => {
  return await Event.find({})
}

export default {
  listEvents,
}
