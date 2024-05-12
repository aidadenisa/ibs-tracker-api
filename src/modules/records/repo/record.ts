import mongoose from 'mongoose'
import { prettifyId } from '@/infra/db/utils'

const RecordSchema = new mongoose.Schema({
  createdOn: Date,
  timezone: String,
  day: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
})
prettifyId(RecordSchema)
const Record = mongoose.model('Record', RecordSchema)

export { Record }
