import mongoose from 'mongoose'
import { prettifyId } from '@/infra/db/utils'

const EventSchema = new mongoose.Schema({
  name: String,
  category_code: { type: String, required: true },
  code: { type: String, required: true },
})
prettifyId(EventSchema)
const Event = mongoose.model('Event', EventSchema)

export { Event }
