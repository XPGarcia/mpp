export type EmailTemplate = "VerifyEmail"

export type SendEmailInput = {
  to: string
  subject: string
  payload: any
}

export type SendVerificationEmailInput = {
  firstName: string
  email: string
  otp: string
}

export interface EmailService {
  send(input: SendEmailInput): Promise<void>
  sendVerificationEmail(input: SendVerificationEmailInput): Promise<void>
}
