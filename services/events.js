import Event from '../models/event.js';

const listEvents = async () => {
  return await Event.find({});
}

export default {
  listEvents
}