import recordsService from '@/modules/records/services/records'
import { NextFunction, Request, Response } from 'express'

const postRecordsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body
  if (!data || !data.eventId) {
    return res
      .status(400)
      .json({ error: 'Missing required properties: eventId' })
  }
  try {
    const result = await recordsService.createNewRecord(data, req.user.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export { postRecordsController }
