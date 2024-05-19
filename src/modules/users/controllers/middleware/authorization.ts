import jwt from 'jsonwebtoken'
import { SECRET } from '@/infra/config/config'
import { User as UserRepo } from '@/modules/users/repo/user'

const authorize = async (req, res, next) => {
  const bearerToken = req.headers.authorization
  const token = bearerToken ? bearerToken.split(' ')[1] : ''
  if (!token || !token.length) {
    return res.status(401).json({ error: 'Missing Authorization Token.' })
  }

  try {
    const decoded = jwt.verify(token, SECRET)

    const user = await UserRepo.findById(decoded['userId'])
    if (!user) {
      return res.status(404).send({ error: 'User not found.' })
    }
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export { authorize }
