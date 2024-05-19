import { NextFunction, Request, Response } from 'express'
import authService from '@/modules/users/services/auth'
import { ValidationResult } from '@/utils/validation'
import { NotFoundError } from '@/utils/errors'

type LoginRequest = {
  email: string
}

const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const { data: input, error: err } = validateRequest(req)
  if (err) {
    return res.status(400).send(err.message)
  }

  const error = await authService.login(input.email)
  if (error instanceof NotFoundError) {
    return res.status(404).send(error.message)
  }

  return res.status(200).send()
}

const validateRequest = (req: Request): ValidationResult<LoginRequest> => {
  const { email, firstName, lastName, hasMenstruationSupport } = req.body
  if (!email) {
    return { data: null, error: { message: 'email is missing' } }
  }

  return {
    data: {
      email: email.trim(),
    },
    error: null,
  }
}

export { loginController }
