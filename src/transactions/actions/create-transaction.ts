import { TransactionRepository } from "../repositories/transaction-repository"

interface CreateTransactionInput {
  userId: number
  date: string
  amount: number
  categoryId: number
  typeId: number
  description?: string
}

export const createTransaction = (input: CreateTransactionInput) => {
  const createdTransaction = TransactionRepository.createOne({ ...input, date: new Date(input.date) })
  if (!createdTransaction) {
    throw new Error("Failed to create transaction")
  }

  return createdTransaction
}
