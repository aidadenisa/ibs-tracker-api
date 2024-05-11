import recordsService from '@/modules/records/services/records'
import { API_SERVER_ERROR, InternalError } from '@/utils/errors'
import { NextFunction, Request, Response } from 'express'

const deleteRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await recordsService.deleteRecord(req.params.id)
  if (result != null && typeof result === typeof InternalError) {
    res.status(API_SERVER_ERROR.statusCode).send(API_SERVER_ERROR.message)
  }
  res.status(204).end()
}

export { deleteRecordController }
