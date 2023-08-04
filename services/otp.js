import crypto from 'crypto';
import bcrypt from 'bcrypt';

import emailService from './email.js';

const numbers = '0123456789';
const charsLower = 'abcdefghijklmnopqrstuvwxyz';
const alphanumeric = numbers + charsLower + charsLower.toUpperCase();

const generateSecret = () => {

  const randomBytes = crypto.randomBytes(16);

  let randomString = '';
  // We take the byte value and get the remainder of dividing it by the length of the alphanumeric string
  for( let i=0; i<randomBytes.length; i++) {
    randomString += alphanumeric.charAt(randomBytes[i] % alphanumeric.length);
  }

  return randomString;
}

const sendOTP = (user, otp, timeToExpire) => {
  emailService.sendOTPEmail(user, otp, timeToExpire);

}

const verifyOTP = async (inputOTP, userOTP, expiryDate) => {

  if(!expiryDate || !userOTP || !inputOTP) {
    throw new Error('Invalid OTP');
  }
  if((new Date()).getTime() > (new Date(expiryDate)).getTime()) {
    throw new Error('OTP has expired');
  }

  const isValid = await bcrypt.compare(inputOTP, userOTP);
  
  return isValid;
}

export default {
  generateSecret, 
  sendOTP,
  verifyOTP,
}