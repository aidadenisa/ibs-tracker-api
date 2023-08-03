import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET } from '../utils/config.js';
import userService from '../services/users.js';
import otpService  from '../services/otp.js';

const login = async (email) => {

  const user = await User.findOne({ email });
  if(!user) throw new Error('User not found.');

  // const { otpKey } = await refreshUserOTP(user);
  const newUser = await refreshUserOTP(user);
  console.log(newUser);

  otpService.sendOTP(user.email, user.otpKey);

  return newUser;
}

const signup = async (data) => {
  data.otpKey = otpService.generateSecret();
  const userData = await userService.createNewUser(data);
  console.log(userData);
  otpService.sendOTP(data.email, data.otpKey);
  return userData;
}

const validateOTP = async (email, inputOTP) => {
  const user = await User.findOne({ email });
  if(!user) throw new Error('User not found.');

  const isValid = otpService.verifyOTP(inputOTP, user.otpKey);

  if(!isValid) {
    throw new Error('Invalid OTP.');
  }

  const tokenData = {
    email: user.email,
    userId: user.id
  }
  const token = jwt.sign(tokenData, SECRET);

  return { token };
}

const refreshUserOTP = (user) => {
  user.otpKey = otpService.generateSecret();

  return userService.updateUser(user._id, { otpKey: user.otpKey });
}

export default {
  login,
  signup,
  validateOTP,
}