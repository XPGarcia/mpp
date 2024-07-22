import { InternalServerError, NotFoundError } from "@/src/utils/errors/errors"
import { TransactionRepository } from "../repositories/transaction-repository"
import { RecurrentTransaction } from "../types"
import { calculateNextTransactionDate } from "./calculate-next-transaction-date"

export const createTransactionFromRecurrent = async (recurrentTransaction: RecurrentTransaction) => {
  const oldTransaction = await TransactionRepository.findOneById(recurrentTransaction.transactionId)
  if (!oldTransaction) {
    console.error("Transaction not found for recurrent", { recurrentTransaction })
    throw new NotFoundError("Transaction not found")
  }

  const newTransaction = await TransactionRepository.createOne({
    ...oldTransaction,
    date: recurrentTransaction.nextDate,
    id: undefined,
  })
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
