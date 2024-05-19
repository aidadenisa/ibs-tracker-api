import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo'
import { BREVO_API_KEY } from '@/infra/config/config'

type EmailContent = {
  subject: string
  sender: {
    email: string
    name: string
  }
  replyTo: {
    email: string
    name: string
  }
  to: Array<{ name: string; email: string }>
  htmlContent: string
  params: {
    otp: string
    timeToExpire: number
  }
}

interface EmailService {
  sendEmail(params: EmailContent): void
}

const emailAPI = new TransactionalEmailsApi()
emailAPI.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY)

const sendEmail = async (params: EmailContent) => {
  emailAPI.sendTransacEmail(params)
}

export default {
  sendEmail,
} as EmailService
