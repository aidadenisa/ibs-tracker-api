import authService from '@/services/auth';
import otpService from '@/services/otp';
import userService from '@/services/users';

const signup = async (userData) => {
  userData.pass = otpService.generateSecret();
  const { id } = await userService.createNewUser(userData);
  return { otp: userData.pass, id };
}

const validateOTP = (email, otp) => {
  return authService.validateOTP(email, otp)
}

export default {
  signup,
  validateOTP,
}