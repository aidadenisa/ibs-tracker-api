import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { NODE_ENV } from '@/infra/config/config'
import logger from '@/utils/logger'

import emailService from '@/infra/services/email'
import { Result } from '@/utils/utils'
import { ValidationError } from '@/utils/errors'

const numbers = '0123456789'
const charsLower = 'abcdefghijklmnopqrstuvwxyz'
const alphanumeric = numbers + charsLower + charsLower.toUpperCase()

interface Recipient {
  firstName: string
  email: string
}

export type JWT = {
  token: string
}
const generateSecret = (): string => {
  const randomBytes = crypto.randomBytes(16)

  let randomString = ''
  // We take the byte value and get the remainder of dividing it by the length of the alphanumeric string
  for (let i = 0; i < randomBytes.length; i++) {
    randomString += alphanumeric.charAt(randomBytes[i] % alphanumeric.length)
  }

  return randomString
}

const sendOTP = async (recipient: Recipient, otp: string, timeToExpireMin: number) => {
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

const verifyOTP = async (inputOTP: string, userOTP: string, expiryDate: Date): Promise<Result<boolean>> => {
  if (!expiryDate || !userOTP || !inputOTP) {
    return { data: null, error: new ValidationError({ message: 'Invalid OTP' }) }
  }
  if (new Date().getTime() > new Date(expiryDate).getTime()) {
    return { data: null, error: new ValidationError({ message: 'OTP has expired.' }) }
  }

  try {
    const isValid = await bcrypt.compare(inputOTP, userOTP)
    return { data: isValid, error: null }
  } catch (error) {
    return { data: null, error: new ValidationError({ message: 'Invalid OTP' }) }
  }
}

export default {
  generateSecret,
  sendOTP,
  verifyOTP,
}
