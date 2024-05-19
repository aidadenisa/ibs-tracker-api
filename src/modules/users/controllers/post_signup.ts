import { NextFunction, Request, Response } from 'express'
import authService from '@/modules/users/services/auth'
import { ValidationResult } from '@/utils/validation'
import { API_SERVER_ERROR } from '@/utils/errors'

type SignupRequest = {
  email: string
  firstName: string
  lastName: string
  hasMenstruationSupport: boolean
}
const signupController = async (req: Request, res: Response, next: NextFunction) => {
  const { data: input, error } = validateRequest(req)
  if (error) {
    return res.status(400).send(`Invalid request data: ${error.message}`)
  }

  const { data: user, error: err } = await authService.signup(input)
  if (err) {
    return res.status(API_SERVER_ERROR.statusCode).send(API_SERVER_ERROR.message)
  }

  return res.status(201).json(user)
}

const validateRequest = (req: Request): ValidationResult<SignupRequest> => {
  const { email, firstName, lastName, hasMenstruationSupport } = req.body
  if (!email) {
    return { data: null, error: { message: 'email is missing' } }
  }

  if (!firstName || !lastName || hasMenstruationSupport === undefined) {
    return { data: null, error: { message: `missing user properties` } }
  }

  return {
    data: {
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      hasMenstruationSupport: hasMenstruationSupport || false,
    },
    error: null,
  }
}

export { signupController }
