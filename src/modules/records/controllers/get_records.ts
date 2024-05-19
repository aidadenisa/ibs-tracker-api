import recordsService from '@/modules/records/services/records'
import { API_SERVER_ERROR } from '@/utils/errors'
import { parseBoolean } from '@/utils/utils'
import { ValidationResult } from '@/utils/validation'
import { NextFunction, Request, Response } from 'express'

type GetRecordsRequest = {
  userId: string
  populate: boolean
}

const getRecordsController = async (req: Request, res: Response, next: NextFunction) => {
  const { data, error }: ValidationResult<GetRecordsRequest> = validateRequest(req)
  if (error) {
    return res.status(400).send(`Invalid request data: ${error.message}`)
  }

  const { data: dataList, error: errorList } = await recordsService.listRecordsByUserId(data.userId, data.populate)
  if (errorList) {
    return res.status(API_SERVER_ERROR.statusCode).send(API_SERVER_ERROR.message)
  }
  return res.json(dataList)
}

const validateRequest = (req: Request): ValidationResult<GetRecordsRequest> => {
  if (!req.user || !req.user.id) {
    return { data: null, error: { message: 'user id is missing' } }
  }

  const populate = req.query['populate'] ? (req.query['populate'] as string).toLowerCase() : ''
  if (populate && populate !== 'true' && populate !== 'false') {
    return { data: null, error: { message: 'populate is invalid' } }
  }

  return {
    data: {
      userId: req.user.id,
      populate: parseBoolean(populate),
    },
    error: null,
  }
}

export { getRecordsController }
