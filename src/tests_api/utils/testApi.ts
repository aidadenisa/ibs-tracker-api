import { User } from '@/modules/users/domain/user'
import authService from '@/modules/users/services/auth'
import otpService from '@/modules/users/services/otp'
import userService from '@/modules/users/services/users'
import { Result } from '@/utils/utils'

type MockSignupResult = {
  otp: string
  id: string
}
const signup = async (userData): Promise<MockSignupResult> => {
  const otp = otpService.generateSecret()
  const { data: user, error } = await userService.createNewUser(userData, otp)
  return { otp: userData.pass, id: user.id }
}

const validateOTP = (email, otp) => {
  return authService.validateOTP(email, otp)
}

export default {
  signup,
  validateOTP,
}
