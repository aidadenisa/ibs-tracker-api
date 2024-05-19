import jwt from 'jsonwebtoken'
import { SECRET } from '@/infra/config/config'
import userService from '@/modules/users/services/users'
import { NextFunction, Response, Request } from 'express'
import { NotFoundError } from '@/utils/errors'

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization
  const token = bearerToken ? bearerToken.split(' ')[1] : ''
  if (!token || !token.length) {
    return res.status(401).json({ error: 'Missing Authorization Token.' })
  }

  let decoded
  try {
    decoded = jwt.verify(token, SECRET)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or missing JWT. Please log in again.' })
    }
  }

  const userId: string = decoded['userId']
  if (!userId) {
    return res.status(404).json({ error: 'Invalid token' })
  }

  const { data: user, error } = await userService.getUserById(userId)
  if (!user || (error && error instanceof NotFoundError)) {
    return res.status(404).json({ error: 'User not found.' })
  }

  if (req.context === undefined) {
    req.context = {}
  }

  req.context.userId = user.id
  next()
}

export { authorize }
