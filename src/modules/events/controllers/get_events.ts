import { Request, Response, NextFunction } from 'express'
import eventsService from '@/modules/events/services/events'
import { API_SERVER_ERROR } from '@/utils/errors'

const getEventsController = async (req: Request, res: Response, next: NextFunction) => {
  const { data, error } = await eventsService.listEvents()
  if (error) {
    return res.status(API_SERVER_ERROR.statusCode).send(API_SERVER_ERROR.message)
  }

  res.status(200).json(data)
}

export { getEventsController }
