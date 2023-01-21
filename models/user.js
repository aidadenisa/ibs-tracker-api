import mongoose from 'mongoose';
import { prettifyId } from '../utils/dbUtils.js';

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  hash: String,
  hasMenstruationSupport: Boolean,
  registeredOn: Date,
});
prettifyId(UserSchema);
const User = mongoose.model('User', UserSchema);

export default User;