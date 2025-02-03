import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { UserRepository } from "@/modules/users/domain"

export type VerifyOTPInput = {
  userId: number
  code: string
}

export type VerifyOTPOutput = Promise<boolean>

export interface VerifyOTPUseCase {
  execute(input: VerifyOTPInput): VerifyOTPOutput
}

@injectable()
export class VerifyOTP implements VerifyOTPUseCase {
  @inject(TYPES.UserRepository) private readonly _userRepository!: UserRepository

  async execute(input: VerifyOTPInput): VerifyOTPOutput {
    const { userId, code } = input
    const user = await this._userRepository.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    return await this._userRepository.verifyOTP(userId, code)
  }
}
