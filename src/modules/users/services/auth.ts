import User from '@/modules/users/repo/user'
import jwt from 'jsonwebtoken'
import { SECRET } from '@/infra/config/config'
import userService from '@/modules/users/services/users'
import otpService from '@/modules/users/services/otp'

const login = async (email) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('User not found.')

  const otp = await refreshUserOTP(user)

  otpService.sendOTP(
    { firstName: user.firstName, email: user.email },
    otp,
    userService.LOGIN_WINDOW
  )

  return
}

const signup = async (data) => {
  data.pass = otpService.generateSecret()
  const userData = await userService.createNewUser(data)
  otpService.sendOTP(
    { firstName: userData.firstName, email: userData.email },
    data.pass,
    userService.LOGIN_WINDOW
  )
  return userData
}

const validateOTP = async (email, inputOTP) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('User not found.')

  const isValid = await otpService.verifyOTP(
    inputOTP,
    user.hash,
    user.accessEndDate
  )

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

const refreshUserOTP = async (user) => {
  const otp = otpService.generateSecret()
  await userService.updateUserOTP(user._id, otp)
  return otp
}

export default {
  login,
  signup,
  validateOTP,
}
