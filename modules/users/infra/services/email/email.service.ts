import { injectable } from "inversify"

import { EmailService, SendEmailInput, SendVerificationEmailInput } from "@/modules/users/domain"
import { Resend } from "resend"
import { OTPEmailTemplate } from "./templates"

const resend = new Resend(process.env.RESEND_API_KEY)

@injectable()
export class ImplEmailService implements EmailService {
  async send(input: SendEmailInput): Promise<void> {
    const { to, subject, payload } = input

    const { error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject,
      react: payload,
    })

    if (error) {
      throw new Error("Failed to send email")
    }
  }

  async sendVerificationEmail(input: SendVerificationEmailInput): Promise<void> {
    const { firstName, email, otp } = input
    await this.send({
      to: email,
      subject: "Verify your email",
      payload: OTPEmailTemplate({ firstName, otp }),
    })
  }
}
