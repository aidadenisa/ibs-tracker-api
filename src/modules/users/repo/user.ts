import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { prettifyId } from '@/infra/db/utils'

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  hash: String,
  hasMenstruationSupport: Boolean,
  registeredOn: Date,
  records: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Record',
    },
  ],
  accessEndDate: Date,
})
prettifyId(UserSchema)
// verify if the values which should be unique are valid
UserSchema.plugin(uniqueValidator)
const User = mongoose.model('User', UserSchema)

export default User
