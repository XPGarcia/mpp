import { inject, injectable } from "inversify"
import { EmailService, UserRepository } from "@/modules/users/domain"
import { TYPES } from "@/modules/container/types"

export type SendVerificationEmailInput = {
  userId: number
}

export type SendVerificationEmailOutput = Promise<void>

export interface SendVerificationEmailUseCase {
  execute(input: SendVerificationEmailInput): SendVerificationEmailOutput
}

@injectable()
export class SendVerificationEmail implements SendVerificationEmailUseCase {
  @inject(TYPES.UserRepository) private readonly _userRepository!: UserRepository
  @inject(TYPES.EmailService) private readonly _emailService!: EmailService

  async execute(input: SendVerificationEmailInput): SendVerificationEmailOutput {
    const { userId } = input
    const user = await this._userRepository.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    const otp = await this._userRepository.createOTP(userId)
    await this._emailService.sendVerificationEmail({ firstName: user.firstName, email: user.email, otp })
  }
}
