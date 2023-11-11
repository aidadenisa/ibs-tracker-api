import Category from '../models/category.js';

const getCategories = async (populate) => {
  if(populate && populate.toLowerCase() === 'true') {
    return await Category.find({}).populate('events');
  }
  return await Category.find({});
}

const getCategoryByCode = async (code, populate) => {
  if(!code) return;
  if(populate) {
    return await Category.findOne({ code }).populate('events');
  }
  return await Category.findOne({ code })
}

export default {
  getCategories,
  getCategoryByCode,
}