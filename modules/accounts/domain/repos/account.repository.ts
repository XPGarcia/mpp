import { Account } from "../entities"

export interface AccountRepository {
  create(data: CreateAccountInput): Promise<Account | undefined>
  findByUserId(userId: number): Promise<Account | undefined>
  findOneById(accountId: number): Promise<Account | undefined>
  updateBalance(id: number, newBalance: number): Promise<void>
}

export type CreateAccountInput = {
  name: string
  userId: number
  balance: number
  currency: string
  id?: number
  createdAt?: Date
  updatedAt?: Date
}
