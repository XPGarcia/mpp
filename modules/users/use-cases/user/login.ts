import bcrypt from "bcrypt"
import { inject, injectable } from "inversify"
import { User, UserRepository } from "@/modules/users/domain"
import { TYPES } from "@/modules/container/types"

const LOGIN_ERRORS = {
  USER_NOT_FOUND: "Invalid credentials",
  INCORRECT_PASSWORD: "Invalid credentials",
  USER_NOT_VERIFIED: "Please verify your email address",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
}

export type LoginInput = {
  email: string
  password: string
}

export type LoginOutput = {
  error?: string
  user: User | null
}

export interface LoginUseCase {
  execute(input: LoginInput): Promise<LoginOutput>
}

@injectable()
export class Login implements LoginUseCase {
  @inject(TYPES.UserRepository) private readonly _userRepository!: UserRepository

  async execute(input: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this._userRepository.findByEmail(input.email)
      if (!user) {
        return { error: LOGIN_ERRORS.USER_NOT_FOUND, user: null }
      }
      const correctPassword = await bcrypt.compare(input.password, user.password)
      if (!correctPassword) {
        return { error: LOGIN_ERRORS.INCORRECT_PASSWORD, user: null }
      }
      if (!user.verifiedAt) {
        return { error: LOGIN_ERRORS.USER_NOT_VERIFIED, user: null }
      }
      return { user }
    } catch (error) {
      console.error(error)
      return { error: LOGIN_ERRORS.INTERNAL_SERVER_ERROR, user: null }
    }
  }
}
