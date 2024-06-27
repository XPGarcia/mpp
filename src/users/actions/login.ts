import { UserRepository } from "../repositories/user-repository"
import bcrypt from "bcrypt"
import { User } from "../types/user"

const LOGIN_ERRORS = {
  USER_NOT_FOUND: "Invalid credentials",
  INCORRECT_PASSWORD: "Invalid credentials",
  USER_NOT_VERIFIED: "Please verify your email address with an admin",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
}

interface LoginInput {
  email: string
  password: string
}

interface LoginOutput {
  error?: string
  user: User | null
}

export const login = async (input: LoginInput): Promise<LoginOutput> => {
  try {
    const user = await UserRepository.findByEmail(input.email)
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
