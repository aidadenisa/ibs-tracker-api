// @ts-expect-error TS(2792): Cannot find module 'mongoose'. Did you mean to set... Remove this comment to see the full error message
import mongoose from 'mongoose';
import { prettifyId } from '../utils/dbUtils';

const RecordSchema = new mongoose.Schema({
  createdOn: Date,
  timezone: String,
  day: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
});
prettifyId(RecordSchema);
const Record = mongoose.model('Record', RecordSchema);

export default Record;