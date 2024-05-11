import recordsService from '@/modules/records/services/records'
import { NextFunction, Request, Response } from 'express'

const postRecordsMultipleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isValidInput(req.body)) {
    return res.status(400).json({
      error:
        'Missing required properties: dateInfo, dateInfo.dayYMD, dateInfo.timezone or selectedEventsIds',
    })
  }
  try {
    const result = await recordsService.updateRecordsForDate(
      req.user.id,
      req.body.dateInfo,
      req.body.selectedEventsIds
    )
    return res.json(result)
  } catch (err) {
    next(err)
  }
}

const isValidInput = (input: any): boolean => {
  return (
    !input ||
    !input.dateInfo ||
    !input.selectedEventsIds ||
    !input.dateInfo?.dayYMD ||
    !input.dateInfo?.timezone
  )
}

export { postRecordsMultipleController }
