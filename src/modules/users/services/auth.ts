import jwt from 'jsonwebtoken'
import { SECRET } from '@/infra/config/config'
import userService, { NewUserInput } from '@/modules/users/services/users'
import otpService, { JWT } from '@/modules/users/services/otp'
import { Result } from '@/utils/utils'
import { User } from '@/modules/users/domain/user'
import { ErrorType, InternalError, NotFoundError, ValidationError } from '@/utils/errors'

const login = async (email: string): Promise<NotFoundError | InternalError> => {
  const { data: user, error } = await userService.getUserByEmail(email)
  if (error) {
    return error
  }
  if (!user) {
    return { message: `User not found.` } as NotFoundError
  }

  const { data: otp, error: err } = await refreshUserOTP(user)
  if (err) {
    return new InternalError({ message: `error while refreshing the OTP: ${err.message}` })
  }

  otpService.sendOTP({ firstName: user.firstName, email: user.email }, otp, userService.LOGIN_WINDOW)

  return null
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

const validateOTP = async (email: string, otp: string): Promise<Result<JWT>> => {
  const { data: user, error: err } = await userService.getUserAuthDataByEmail(email)
  if (err) {
    return { data: null, error: err }
  }
  if (!user) {
    return { data: null, error: new NotFoundError({ message: 'User not found.' }) }
  }

  const { data: isValid, error: er } = await otpService.verifyOTP(otp, user.hash, user.accessEndDate)
  if (!isValid || (er && er.type === ErrorType.ErrValidation)) {
    return { data: null, error: new ValidationError({ message: `Invalid OTP: ${er.message}` }) }
  }
  if (er) {
    return { data: null, error: err }
  }

  const error = await userService.resetUserOTP(user.id)
  if (error) {
    return { data: null, error }
  }

  const tokenData = {
    email: user.email,
    userId: user.id,
  }
  const token = jwt.sign(tokenData, SECRET)

  return { data: { token }, error: null }
}

const refreshUserOTP = async (user: User): Promise<Result<string>> => {
  const otp = otpService.generateSecret()

  const error = await userService.updateUserOTP(user.id, otp)
  if (error) {
    return { data: null, error: error }
  }

  return { data: otp, error: null }
}

export default {
  login,
  signup,
  validateOTP,
}
