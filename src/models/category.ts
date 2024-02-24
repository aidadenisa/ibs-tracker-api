// @ts-expect-error TS(2792): Cannot find module 'mongoose'. Did you mean to set... Remove this comment to see the full error message
import mongoose from 'mongoose';
import { prettifyId } from '../utils/dbUtils';

const CategorySchema = new mongoose.Schema({
  name: String,
  code: { type: String, unique: true, required: true },
  events: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
  }]
});
prettifyId(CategorySchema);
const Category = mongoose.model('Category', CategorySchema)

export default Category;
