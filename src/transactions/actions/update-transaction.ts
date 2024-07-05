import { getTransactionTypeFromId, getTransactionTypeId } from "@/src/utils/get-transaction-type-id"
import { TransactionRepository } from "../repositories/transaction-repository"
import { TransactionType } from "../types"

interface UpdateTransactionInput {
  id: number
  date?: Date
  amount?: number
  categoryId?: number
  type?: TransactionType
  description?: string
}

export const updateTransaction = async (input: UpdateTransactionInput) => {
  const { id, ...data } = input
  const transaction = await TransactionRepository.findOneById(id)
  if (!transaction) {
    throw new Error("Transaction not found")
  }

  const typeId = data.type ? getTransactionTypeId(data.type) : undefined
  const createdTransaction = TransactionRepository.updateOne(transaction.id, { ...data, typeId })
  if (!createdTransaction) {
    throw new Error("Failed to create transaction")
  }

  return createdTransaction
}
