import { AccountBalanceEntry } from "../entities"

export interface AccountBalanceEntryRepository {
  findOneByAccountAndDate(accountId: number, date: Date): Promise<AccountBalanceEntry | undefined>
  createOne(input: CreateAccountBalanceEntryInput): Promise<AccountBalanceEntry | undefined>
  updateAmount(id: number, newAmount: number): Promise<void>
}

export type CreateAccountBalanceEntryInput = {
  accountId: number
  amount: number
  description: string
  id?: number
  createdAt?: Date
  updatedAt?: Date
  dateFrom?: Date | null
  dateTo?: Date | null
}
