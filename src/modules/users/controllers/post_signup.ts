import { NextFunction, Request, Response } from 'express'
import authService from '@/modules/users/services/auth'

const signupController = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body
  if (!data.email) {
    return res.status(400).json({ error: 'You need to specify an email for the user' })
  }
  try {
    const result = await authService.signup(data)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export { signupController }
