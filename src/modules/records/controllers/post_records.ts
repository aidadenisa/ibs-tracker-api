import recordsService from '@/modules/records/services/records'
import { API_SERVER_ERROR } from '@/utils/errors'
import { NextFunction, Request, Response } from 'express'

const postRecordsController = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body
  if (!body || !body.eventId) {
    return res.status(400).json({ error: 'Missing required properties: eventId' })
  }

  const { data, error } = await recordsService.createNewRecord(body, req.user.id)
  if (error !== null) {
    res.status(API_SERVER_ERROR.statusCode).send(API_SERVER_ERROR.message)
  }

  res.json(data)
}

export { postRecordsController }
