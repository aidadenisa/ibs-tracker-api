import mongoose from 'mongoose';
import { prettifyId } from '../utils/dbUtils.js';

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
