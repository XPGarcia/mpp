import { User } from "../types/user"
import { UserRepository } from "../repositories/user-repository"
import bcrypt from "bcrypt"

interface CreateUserInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const { firstName, lastName, email, password } = input
  const user = await UserRepository.findByEmail(email)
  if (user) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const createdUser = await UserRepository.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  })

  return createdUser
}
