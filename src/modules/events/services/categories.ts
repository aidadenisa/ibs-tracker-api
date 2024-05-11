import Category from '@/modules/events/repo/category'

const getCategories = async (populate: boolean) => {
  if (populate) {
    return await Category.find({}).populate('events')
  }
  return await Category.find({})
}

export default {
  getCategories,
}
