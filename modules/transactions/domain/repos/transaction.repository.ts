import { Transaction, TransactionType } from "../entities"

export interface TransactionRepository {
  createOne(input: CreateTransactionInput): Promise<Transaction | undefined>
  findOneById(transactionId: number): Promise<Transaction | undefined>
  findAllByCategoryId(categoryId: number): Promise<Transaction[]>
  updateOne(transactionId: number, input: UpdateTransactionInput): Promise<Transaction | undefined>
  deleteOne(transactionId: number): Promise<void>
  countByCategoryId(categoryId: number): Promise<number>
  updateManyByCategoryId(categoryId: number, input: UpdateTransactionInput): Promise<void>
  updateManyByRecurrentId(categoryId: number, input: UpdateTransactionInput): Promise<void>
  findManyByUserAndFilters(userId: number, filters: FindUserTransactionsFilters): Promise<Transaction[]>
}

export type CreateTransactionInput = {
  userId: number
  date: Date
  categoryId: number
  accountId: number
  amount: number
  id?: number
  createdAt?: Date
  updatedAt?: Date
  description?: string | null
  type: TransactionType
  recurrentTransactionId?: number | null
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>

export type FindUserTransactionsFilters = {
  date?: { month: string; year: string }
  categoriesIds?: number[]
}
