import { totp } from 'otplib';
import crypto from 'crypto';

totp.options = {
  digits: 6, // Number of OTP digits (default is 6)
  algorithm: 'sha512', // Hashing algorithm (default is 'sha1')
  step: 90, // seconds
};

const generateSecret = () => {
  return crypto.randomBytes(64).toString('hex');
}

const sendOTP = (email, secret) => {
  const token = totp.generate(secret);

  console.log('secret: ', secret);
  //sendTextMail
  console.log('token: ', token);

}

const verifyOTP = (inputOTP, secret) => {
  const isValid = totp.check(inputOTP, secret);
  console.log(totp.timeRemaining())
  console.log(isValid)
  return isValid;
}

export default {
  generateSecret, 
  sendOTP,
  verifyOTP,
}