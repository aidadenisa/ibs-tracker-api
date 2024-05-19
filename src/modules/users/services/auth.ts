import { User as UserRecord } from '@/modules/users/repo/user'
import jwt from 'jsonwebtoken'
import { SECRET } from '@/infra/config/config'
import userService, { NewUserInput } from '@/modules/users/services/users'
import otpService from '@/modules/users/services/otp'
import { Result } from '@/utils/utils'
import { User } from '@/modules/users/domain/user'
import { InternalError, NotFoundError } from '@/utils/errors'

const login = async (email: string): Promise<NotFoundError | InternalError> => {
  const { data: user, error } = await userService.getUserByEmail(email)
  if (error) {
    return error
  }
  if (!user) {
    return { message: `User not found.` } satisfies NotFoundError
  }

  const otp = await refreshUserOTP(user)

  otpService.sendOTP({ firstName: user.firstName, email: user.email }, otp, userService.LOGIN_WINDOW)

  return
}

const signup = async (input: NewUserInput): Promise<Result<User>> => {
  const otp = otpService.generateSecret()
  const { data: user, error } = await userService.createNewUser(input, otp)
  if (error) {
    return { data: null, error }
  }
  if (user && user.email) {
    otpService.sendOTP({ firstName: user.firstName, email: user.email }, otp, userService.LOGIN_WINDOW)
  }
  return { data: user, error: null }
}

const validateOTP = async (email, inputOTP) => {
  const user = await UserRecord.findOne({ email })
  if (!user) throw new Error('User not found.')

  const isValid = await otpService.verifyOTP(inputOTP, user.hash, user.accessEndDate)

  if (!isValid) {
    throw new Error('Invalid OTP.')
  }

  userService.resetUserOTP(user._id)

  const tokenData = {
    email: user.email,
    userId: user.id,
  }
  const token = jwt.sign(tokenData, SECRET)

  return { token }
}

const refreshUserOTP = async (user: User) => {
  const otp = otpService.generateSecret()
  await userService.updateUserOTP(user.id, otp)
  return otp
}

export default {
  login,
  signup,
  validateOTP,
}
