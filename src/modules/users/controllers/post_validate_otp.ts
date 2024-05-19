import { NextFunction, Request, Response } from 'express'
import authService from '@/modules/users/services/auth'
import { ValidationResult } from '@/utils/validation'
import { API_SERVER_ERROR, ValidationError } from '@/utils/errors'

type ValidateOTPRequest = {
  email: string
  otp: string
}
const validateOTPController = async (req: Request, res: Response, next: NextFunction) => {
  const { data: input, error } = validateRequest(req)
  if (error) {
    return res.status(400).json({ error: `Invalid request data: ${error.message}` })
  }

  const { data: jwt, error: err } = await authService.validateOTP(input.email, input.otp)
  if (err && err instanceof ValidationError) {
    return res.status(400).json({ error: err.message })
  }
  if (err) return res.status(API_SERVER_ERROR.statusCode).json({ error: API_SERVER_ERROR.message })

  return res.json(jwt)
}

const validateRequest = (req: Request): ValidationResult<ValidateOTPRequest> => {
  const { email, otp } = req.body
  if (!email || !otp) {
    return { data: null, error: new ValidationError({ message: 'email or OTP is missing' }) }
  }

  return {
    data: {
      email: email.trim(),
      otp: otp.trim(),
    },
    error: null,
  }
}

export { validateOTPController }
