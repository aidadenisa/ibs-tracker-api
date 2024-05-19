import { User } from '@/modules/users/domain/user'
import authService from '@/modules/users/services/auth'
import otpService from '@/modules/users/services/otp'
import userService, { NewUserInput } from '@/modules/users/services/users'
import { Result } from '@/utils/utils'

type MockSignupResult = {
  otp: string
  id: string
}
const signup = async (userData: NewUserInput): Promise<MockSignupResult> => {
  const otp = otpService.generateSecret()
  const { data: user, error } = await userService.createNewUser(userData, otp)
  return { otp: otp, id: user.id }
}

const validateOTP = (email: string, otp: string) => {
  return authService.validateOTP(email, otp)
}

export default {
  signup,
  validateOTP,
}
