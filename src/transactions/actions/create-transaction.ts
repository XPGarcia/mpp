import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"
import { TransactionRepository } from "../repositories/transaction-repository"
import { TransactionType } from "../types"

interface CreateTransactionInput {
  userId: number
  date: Date
  amount: number
  categoryId: number
  type: TransactionType
  description?: string
}

export const createTransaction = (input: CreateTransactionInput) => {
  const typeId = getTransactionTypeId(input.type)

  const createdTransaction = TransactionRepository.createOne({ ...input, typeId, date: new Date(input.date) })
  if (!createdTransaction) {
    throw new Error("Failed to create transaction")
  }

  return createdTransaction
}
