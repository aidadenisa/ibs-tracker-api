import mongoose from 'mongoose';
import { prettifyId } from '../utils/dbUtils.js';

const EventSchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  code: { type : String , unique : true, required : true }
});
prettifyId(EventSchema);
const Event = mongoose.model('Event', EventSchema);

export default Event;