import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { NODE_ENV } from '@/utils/config'
import logger from '@/utils/logger'

import emailService from '@/services/email'
import { User } from '@/models/interfaces'

const numbers = '0123456789'
const charsLower = 'abcdefghijklmnopqrstuvwxyz'
const alphanumeric = numbers + charsLower + charsLower.toUpperCase()

interface Recipient {
  firstName: string
  email: string
}

const generateSecret = () => {
  const randomBytes = crypto.randomBytes(16)

  let randomString = ''
  // We take the byte value and get the remainder of dividing it by the length of the alphanumeric string
  for (let i = 0; i < randomBytes.length; i++) {
    randomString += alphanumeric.charAt(randomBytes[i] % alphanumeric.length)
  }

  return randomString
}

const sendOTP = async (
  recipient: Recipient,
  otp: string,
  timeToExpireMin: number
) => {
  // shortcircuit the email for now, console.log OTP for local development
  if (NODE_ENV === 'dev' || NODE_ENV === 'test') {
    console.log('otp: ', otp)
    return
  }

  try {
    emailService.sendEmail({
      subject: 'Track IBS - Login using OTP',
      sender: {
        email: 'no-reply@notifications.trackibs.com',
        name: 'Noreply Track IBS',
      },
      replyTo: {
        email: 'no-reply@notifications.trackibs.com',
        name: 'Noreply Track IBS',
      },
      to: [{ name: recipient.firstName, email: recipient.email }],
      htmlContent: `<html><body>
          <h1>Login using OTP</h1>
          <p>
            Please use this code to login into Track IBS: <strong>{{params.otp}}</strong> 
            <br/>
            This code expires in <strong>{{params.timeToExpire}}</strong> minutes.
            This code is confidential, do NOT share it with anybody.
          <p>

          <p>All the best, <br/> The Track IBS Team.</p>
          
          </body></html>`,
      params: {
        otp: otp,
        timeToExpire: timeToExpireMin,
      },
    })
  } catch (error) {
    logger.error(error)
  }
}

const verifyOTP = async (inputOTP, userOTP, expiryDate) => {
  if (!expiryDate || !userOTP || !inputOTP) {
    throw new Error('Invalid OTP')
  }
  if (new Date().getTime() > new Date(expiryDate).getTime()) {
    throw new Error('OTP has expired')
  }

  const isValid = await bcrypt.compare(inputOTP, userOTP)

  return isValid
}

export default {
  generateSecret,
  sendOTP,
  verifyOTP,
}
