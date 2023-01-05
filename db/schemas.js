import mongoose from 'mongoose';

const prettifyId = (schema) => {
  schema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
}

const CategorySchema = new mongoose.Schema({
  name: String,
});
prettifyId(CategorySchema);
const Category = mongoose.model('Category', CategorySchema)

const EventSchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
});
prettifyId(EventSchema);
const Event = mongoose.model('Event', EventSchema);

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

const RecordSchema = new mongoose.Schema({
  date: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event'}
});
prettifyId(RecordSchema);
const Record = mongoose.model('Record', RecordSchema);


export {
  Event, 
  Category, 
  Record,
  User,
}