import { Transaction, TransactionFrequency, TransactionType } from "../entities"

export interface TransactionRepository {
  createOne(input: CreateTransactionInput): Promise<Transaction | undefined>
  findOneById(transactionId: number): Promise<Transaction | undefined>
  findAllByUserId(userId: number): Promise<Transaction[]>
  findAllByCategoryId(categoryId: number): Promise<Transaction[]>
  findManyByUserIdAndMonthRange(userId: number, options: { month: string; year: string }): Promise<Transaction[]>
  updateOne(transactionId: number, input: UpdateTransactionInput): Promise<Transaction | undefined>
  deleteOne(transactionId: number): Promise<void>
  countByCategoryId(categoryId: number): Promise<number>
  updateManyByCategoryId(categoryId: number, input: UpdateTransactionInput): Promise<void>
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
  isRecurrent: boolean
  frequency?: TransactionFrequency
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>
