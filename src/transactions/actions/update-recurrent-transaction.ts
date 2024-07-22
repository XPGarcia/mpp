import { TransactionRepository } from "../repositories/transaction-repository"
import { RecurrentTransaction, Transaction, TransactionFrequency } from "../types"
import { calculateNextTransactionDate } from "./calculate-next-transaction-date"

interface UpdateRecurrentTransactionInput {
  oldTransaction: Transaction
  updatedTransaction: Transaction
  newIsRecurrent: boolean
  newFrequency?: TransactionFrequency
}

export const updateRecurrentTransaction = async (
  input: UpdateRecurrentTransactionInput
): Promise<RecurrentTransaction | undefined> => {
  const { oldTransaction, updatedTransaction, newIsRecurrent, newFrequency } = input
  if (!newIsRecurrent) {
    await TransactionRepository.deleteRecurrentByParentId(oldTransaction.id)
    return
  }
  if (!newFrequency) {
    console.error("Frequency is required to update recurrent transactions", { input })
    throw new Error("Frequency is required to update recurrent transactions")
  }
  const recurrentTransaction = await TransactionRepository.findRecurrentByParentId(oldTransaction.id)
  if (!recurrentTransaction) {
    console.error("Recurrent transaction not found", { input })
    throw new Error("Recurrent transaction not found")
  }
  const updatedRecurrentTransaction = await TransactionRepository.updateRecurrent(recurrentTransaction.id, {
    frequency: newFrequency,
    startDate: updatedTransaction.date,
    nextDate: calculateNextTransactionDate(updatedTransaction.date, newFrequency),
  })
  if (!updatedRecurrentTransaction) {
    console.error("Failed to update recurrent transaction", { input })
    throw new Error("Failed to update recurrent transaction")
  }
  return updatedRecurrentTransaction
}
