import { User } from "../entities"

export interface UserRepository {
  create(input: CreateUserInput): Promise<User>
  findByEmail(email: string): Promise<User | undefined>
  findById(id: number): Promise<User | undefined>
  update(id: number, input: UpdateUserInput): Promise<User | undefined>
}

export type CreateUserInput = {
  firstName: string
  lastName: string
  email: string
  password: string
  id?: number
  verifiedAt?: Date | null
  onboardedAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export type UpdateUserInput = Partial<CreateUserInput>
