import express from 'express'
import categoriesService from '@/modules/events/services/categories'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const populate = req.query.populate === 'true'
    const result = await categoriesService.getCategories(populate)
    return res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

export default router
