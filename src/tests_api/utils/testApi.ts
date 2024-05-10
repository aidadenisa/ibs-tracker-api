import authService from '@/modules/users/services/auth'
import otpService from '@/modules/users/services/otp'
import userService from '@/modules/users/services/users'

const signup = async (userData) => {
  userData.pass = otpService.generateSecret()
  const { id } = await userService.createNewUser(userData)
  return { otp: userData.pass, id }
}

const validateOTP = (email, otp) => {
  return authService.validateOTP(email, otp)
}

export default {
  signup,
  validateOTP,
}
