import { InternalServerError, NotFoundError } from "@/src/utils/errors/errors"
import { TransactionRepository } from "../repositories/transaction-repository"
import { RecurrentTransaction } from "../types"
import { calculateNextTransactionDate } from "./calculate-next-transaction-date"
import { createTransaction } from "./create-transaction"

export const createTransactionFromRecurrent = async (recurrentTransaction: RecurrentTransaction) => {
  const oldTransaction = await TransactionRepository.findOneById(recurrentTransaction.transactionId)
  if (!oldTransaction) {
    console.error("Transaction not found for recurrent", { recurrentTransaction })
    throw new NotFoundError("Transaction not found")
  }

  const newTransaction = await createTransaction({
    amount: oldTransaction.amount,
    categoryId: oldTransaction.categoryId,
    type: oldTransaction.type,
    userId: oldTransaction.userId,
    description: oldTransaction.description,
    date: recurrentTransaction.nextDate,
    isRecurrent: true,
    frequency: recurrentTransaction.frequency,
  })
  // TODO: Change to upsert
  const updatedRecurrentTransaction = await TransactionRepository.updateRecurrent(recurrentTransaction.id, {
    transactionId: newTransaction.id,
    nextDate: calculateNextTransactionDate(recurrentTransaction.nextDate, recurrentTransaction.frequency),
  })
  if (!updatedRecurrentTransaction) {
    console.error("Failed to update recurrent transaction", { recurrentTransaction })
    throw new InternalServerError("Failed to update recurrent transaction")
  }

  return newTransaction
}
