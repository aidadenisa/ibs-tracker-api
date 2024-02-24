const sib = require('@getbrevo/brevo');
import { NODE_ENV, BREVO_API_KEY } from '../utils/config';
import logger from '../utils/logger';

sib.ApiClient.instance.authentications['api-key'].apiKey = BREVO_API_KEY;
const emailAPI = new sib.TransactionalEmailsApi();

const EMAIL_PROVIDER__BREVO = 'BREVO';

const sendEmail = async (provider, params) => {
  if (provider === EMAIL_PROVIDER__BREVO) {
    await emailAPI.sendTransacEmail(params)
  }
}

const sendOTPEmail = async (recipient, otp, timeToExpire) => {

  // shortcircuit the email for now, console.log OTP for local development
  if (NODE_ENV === 'dev' || NODE_ENV === 'test') {
    console.log('otp: ', otp);
    return;
  }

  try {
    // TODO: refactor this nicer using design patterns
    await sendEmail(EMAIL_PROVIDER__BREVO,
      {
        'subject': 'Track IBS - Login using OTP',
        'sender': { 'email': 'no-reply@notifications.trackibs.com', 'name': 'Noreply Track IBS' },
        'replyTo': { 'email': 'no-reply@notifications.trackibs.com', 'name': 'Noreply Track IBS' },
        'to': [{ 'name': recipient.firstName, 'email': recipient.email }],
        'htmlContent': `<html><body>
          <h1>Login using OTP</h1>
          <p>
            Please use this code to login into Track IBS: <strong>{{params.otp}}</strong> 
            <br/>
            This code expires in <strong>{{params.timeToExpire}}</strong> minutes.
            This code is confidential, do NOT share it with anybody.
          <p>

          <p>All the best, <br/> The Track IBS Team.</p>
          
          </body></html>`,
        'params': {
          'otp': otp,
          'timeToExpire': timeToExpire
        }
      }
    )

  } catch (error) {
    logger.error(error);
  }

}

export default {
  sendOTPEmail,
}
