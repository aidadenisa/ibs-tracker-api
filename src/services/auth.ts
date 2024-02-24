import User from '../models/user.js';
// @ts-expect-error TS(2792): Cannot find module 'bcrypt'. Did you mean to set t... Remove this comment to see the full error message
import bcrypt from 'bcrypt';
// @ts-expect-error TS(2792): Cannot find module 'jsonwebtoken'. Did you mean to... Remove this comment to see the full error message
import jwt from 'jsonwebtoken';
import { SECRET } from '../utils/config.js';
import userService from '../services/users.js';
import otpService  from '../services/otp.js';

const login = async (email) => {

  const user = await User.findOne({ email });
  if(!user) throw new Error('User not found.');

  const otp = await refreshUserOTP(user);

  otpService.sendOTP(user, otp, userService.LOGIN_WINDOW);

  return;
}

const signup = async (data) => {
  data.pass = otpService.generateSecret();
  const userData = await userService.createNewUser(data);
  otpService.sendOTP(userData, data.pass, userService.LOGIN_WINDOW);
  return userData;
}

const validateOTP = async (email, inputOTP) => {
  const user = await User.findOne({ email });
  if(!user) throw new Error('User not found.');

  const isValid = await otpService.verifyOTP(inputOTP, user.hash, user.accessEndDate);

  if(!isValid) {
    throw new Error('Invalid OTP.');
  }

  userService.resetUserOTP(user._id);

  const tokenData = {
    email: user.email,
    userId: user.id
  }
  const token = jwt.sign(tokenData, SECRET);

  return { token };
}

const refreshUserOTP = async ( user ) => {
  const otp = otpService.generateSecret();
  await userService.updateUserOTP(user._id, otp);
  return otp;
}

export default {
  login,
  signup,
  validateOTP,
}