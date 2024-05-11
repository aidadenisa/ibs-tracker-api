import recordsService from '@/modules/records/services/records'
import { NextFunction, Request, Response } from 'express'

const putRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body && !req.body.eventId) {
    return res
      .status(400)
      .json({ error: 'You need to specify an event for updating the record.' })
  }
  try {
    const result = await recordsService.updateRecordProperties(
      req.params.id,
      req.body
    )
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export { putRecordController }
