import recordsService from '@/modules/records/services/records'
import { API_SERVER_ERROR } from '@/utils/errors'
import { NextFunction, Request, Response } from 'express'

const postRecordsMultipleController = async (req: Request, res: Response, next: NextFunction) => {
  if (!isValidInput(req.body)) {
    return res.status(400).json({
      error: 'Missing required properties: dateInfo, dateInfo.dayYMD, dateInfo.timezone or selectedEventsIds',
    })
  }

  const err = await recordsService.updateRecordsForDate(req.context.userId, req.body.dateInfo, req.body.selectedEventsIds)
  if (err !== null) {
    return res.status(API_SERVER_ERROR.statusCode).json({ error: API_SERVER_ERROR.message })
  }

  return res.status(200).end()
}

const isValidInput = (input: any): boolean => {
  return !!(input && input.dateInfo && input.selectedEventsIds && input.dateInfo?.dayYMD && input.dateInfo?.timezone)
}

export { postRecordsMultipleController }
