// @ts-expect-error TS(2792): Cannot find module 'mongoose'. Did you mean to set... Remove this comment to see the full error message
import mongoose from 'mongoose';
import { prettifyId } from '../utils/dbUtils';

const EventSchema = new mongoose.Schema({
  name: String,
  category_code: { type: String, required: true },
  code: { type: String, required: true }
});
prettifyId(EventSchema);
const Event = mongoose.model('Event', EventSchema);

export default Event;