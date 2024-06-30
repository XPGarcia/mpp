import { TransactionRepository } from "../repositories/transaction-repository"

interface UpdateTransactionInput {
  id: number
  date?: Date
  amount?: number
  categoryId?: number
  typeId?: number
  description?: string
}

export const updateTransaction = async (input: UpdateTransactionInput) => {
  const { id, ...data } = input
  const transaction = await TransactionRepository.findOneById(id)
  if (!transaction) {
    throw new Error("Transaction not found")
  }

  const createdTransaction = TransactionRepository.updateOne(transaction.id, data)
  if (!createdTransaction) {
    throw new Error("Failed to create transaction")
  }

  return createdTransaction
}
