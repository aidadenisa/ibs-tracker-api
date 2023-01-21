import Event from '../models/event.js';

const listEvents = async () => {
  return await Event.find({}).populate('category');
}

export default {
  listEvents
}