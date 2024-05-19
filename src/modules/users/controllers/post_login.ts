import { NextFunction, Request, Response } from 'express'
import authService from '@/modules/users/services/auth'
import { ValidationResult } from '@/utils/validation'
import { API_SERVER_ERROR, NotFoundError, ValidationError } from '@/utils/errors'

type LoginRequest = {
  email: string
}

const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const { data: input, error: err } = validateRequest(req)
  if (err) {
    return res.status(400).json({ error: err.message })
  }

  const error = await authService.login(input.email)
  if (error && error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message })
  }
  if (error) {
    return res.status(API_SERVER_ERROR.statusCode).json({ error: API_SERVER_ERROR.message })
  }

  return res.status(200).send()
}

const validateRequest = (req: Request): ValidationResult<LoginRequest> => {
  const { email } = req.body
  if (!email) {
    return { data: null, error: new ValidationError({ message: 'email is missing' }) }
  }

  return {
    data: {
      email: email.trim(),
    },
    error: null,
  }
}

export { loginController }
