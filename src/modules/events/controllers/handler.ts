import express from 'express'
import { getEventsController } from '@/modules/events/controllers/get_events'
import { getCategoriesController } from '@/modules/events/controllers/get_categories'

const router = express.Router()

router.get('/', getEventsController)

router.get('/categories', getCategoriesController)

export default router
