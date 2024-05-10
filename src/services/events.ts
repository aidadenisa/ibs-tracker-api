import Event from '@/models/event';

const listEvents = async () => {
  return await Event.find({});
}

export default {
  listEvents
}