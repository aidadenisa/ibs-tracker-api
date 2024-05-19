import { Request, Response, NextFunction } from 'express'
import categoriesService from '@/modules/events/services/categories'
import { API_SERVER_ERROR } from '@/utils/errors'

const getCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  const populate = req.query.populate === 'true'
  const { data, error } = await categoriesService.getCategories(populate)
  if (error) {
    return res.status(API_SERVER_ERROR.statusCode).json({ error: API_SERVER_ERROR.message })
  }
  return res.status(200).json(data)
}

export { getCategoriesController }
