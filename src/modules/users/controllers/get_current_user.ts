import userService from '@/modules/users/services/users'
import { ValidationResult } from '@/utils/validation'
import { NextFunction, Request, Response } from 'express'
import { parseBoolean } from '@/utils/utils'
import { API_SERVER_ERROR, ValidationError } from '@/utils/errors'

type GetCurrentUserRequest = {
  userId: string
  populate: boolean
}

const getCurrentUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { data: input, error: err }: ValidationResult<GetCurrentUserRequest> = validateRequest(req)
  if (err) {
    return res.status(400).json({ error: `Invalid request data: ${err.message}` })
  }

  const { data: user, error } = await userService.getUserById(input.userId, input.populate)
  if (error) {
    return res.status(API_SERVER_ERROR.statusCode).json({ error: API_SERVER_ERROR.message })
  }
  return res.json(user)
}

const validateRequest = (req: Request): ValidationResult<GetCurrentUserRequest> => {
  if (!req.user || !req.user.id) {
    return { data: null, error: new ValidationError({ message: 'user id is missing' }) }
  }

  const populate = req.query['populate'] ? (req.query['populate'] as string).toLowerCase() : ''
  if (populate && populate !== 'true' && populate !== 'false') {
    return { data: null, error: new ValidationError({ message: 'populate is invalid' }) }
  }

  return {
    data: {
      userId: req.user.id,
      populate: parseBoolean(populate),
    },
    error: null,
  }
}

export { getCurrentUserController }
