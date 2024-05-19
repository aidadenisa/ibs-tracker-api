import { NextFunction, Request, Response } from 'express'
import authService from '@/modules/users/services/auth'

const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email and password required.' })
  }
  try {
    await authService.login(email)
    res.status(200).send()
  } catch (err) {
    next(err)
  }
}

export { loginController }
