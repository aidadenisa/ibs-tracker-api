import crypto from 'crypto';
import bcrypt from 'bcrypt';

const numbers = '0123456789';
const charsLower = 'abcdefghijklmnopqrstuvwxyz';
const alphanumeric = numbers + charsLower + charsLower.toUpperCase();

// The problem is that I do not want the user to set a password
// I want them to log in using a random generated password 
// every time they want to log in
// I want the password to be long and complex so that it won't be easy to guess 

const generateSecret = () => {

  const randomBytes = crypto.randomBytes(16);

  let randomString = '';
  // We take the byte value and get the remainder of dividing it by the length of the alphanumeric string
  for( let i=0; i<randomBytes.length; i++) {
    randomString += alphanumeric.charAt(randomBytes[i] % alphanumeric.length);
  }

  return randomString;
}

const sendOTP = (email, otp) => {

  console.log('email: ', email);
  //sendTextMail
  console.log('otp: ', otp);

}

const verifyOTP = async (inputOTP, userOTP, expiryDate) => {

  if(!expiryDate || !userOTP || !inputOTP) {
    throw new Error('Invalid OTP');
  }
  if((new Date()).getTime() > (new Date(expiryDate)).getTime()) {
    throw new Error('OTP has expired.');
  }

  const isValid = await bcrypt.compare(inputOTP, userOTP);
  console.log(isValid)
  
  return isValid;
}

export default {
  generateSecret, 
  sendOTP,
  verifyOTP,
}