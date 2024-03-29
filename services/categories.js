import Category from '../models/category.js';

const getCategories = async (populate) => {
  if(populate && populate.toLowerCase() === 'true') {
    return await Category.find({}).populate('events');
  }
  return await Category.find({});
}

export default {
  getCategories
}