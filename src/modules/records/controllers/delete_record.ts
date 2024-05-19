import recordsService from '@/modules/records/services/records'
import { API_SERVER_ERROR, ErrorType, InternalError } from '@/utils/errors'
import { NextFunction, Request, Response } from 'express'

const deleteRecordController = async (req: Request, res: Response, next: NextFunction) => {
  const error = await recordsService.deleteRecord(req.params.id)
  if (error && error.type === ErrorType.ErrInternal) {
    res.status(API_SERVER_ERROR.statusCode).json({ error: API_SERVER_ERROR.message })
  }
  res.status(204).end()
}

export { deleteRecordController }
