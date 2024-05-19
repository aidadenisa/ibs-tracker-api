import { NextFunction, Request, Response } from 'express'
import authService from '@/modules/users/services/auth'

const validateOTPController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and otp required.' })
  }
  try {
    const result = await authService.validateOTP(email, otp)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export { validateOTPController }
