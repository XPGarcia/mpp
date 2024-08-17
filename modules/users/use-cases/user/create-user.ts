import bcrypt from "bcrypt"
import { inject, injectable } from "inversify"
import { User, UserRepository } from "@/modules/users/domain"
import { TYPES } from "@/modules/container/types"

export type CreateUserInput = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type CreateUserOutput = Promise<User>

export interface CreateUserUseCase {
  execute(input: CreateUserInput): CreateUserOutput
}

@injectable()
export class CreateUser implements CreateUserUseCase {
  @inject(TYPES.UserRepository) private readonly _userRepository!: UserRepository

  async execute(input: CreateUserInput): CreateUserOutput {
    const { firstName, lastName, email, password } = input
    const user = await this._userRepository.findByEmail(email)
    if (user) {
      throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const createdUser = await this._userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })

    return createdUser
  }
}
