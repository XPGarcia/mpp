import { accountBalanceEntriesClient, accountsClient } from "@/modules/accounts"
import { TransactionRepository } from "../repositories/transaction-repository"
import { TransactionFrequency, TransactionType } from "../types"
import { calculateAmountForBalance } from "./calculate-amount-for-balance"
import { updateRecurrentTransaction } from "./update-recurrent-transaction"

interface UpdateTransactionInput {
  id: number
  date: Date
  amount?: number
  categoryId?: number
  type?: TransactionType
  description?: string
  isRecurrent?: boolean
  frequency?: TransactionFrequency
}

export const updateTransaction = async (input: UpdateTransactionInput) => {
  const { id, frequency, isRecurrent, ...data } = input
  const oldTransaction = await TransactionRepository.findOneById(id)
  if (!oldTransaction) {
    throw new Error("Transaction not found")
  }

  const accountBalanceEntry = await accountBalanceEntriesClient.getAccountBalanceEntryByDate({
    userId: oldTransaction.userId,
    date: input.date,
  })

  const updatedTransaction = await TransactionRepository.updateOne(oldTransaction.id, data)
  if (!updatedTransaction) {
    throw new Error("Failed to create transaction")
  }
  const amount = calculateAmountForBalance(oldTransaction, updatedTransaction)
  await accountsClient.updateBalance({ accountBalanceEntry, amount })

  if (isRecurrent === undefined) {
    return updatedTransaction
  }

  const oldRecurrentTransaction = await TransactionRepository.findRecurrentByParentId(oldTransaction.id)
  if (!!oldRecurrentTransaction) {
    oldTransaction.isRecurrent = true
    oldTransaction.frequency = oldRecurrentTransaction.frequency
  }

  const updatedRecurrentTransaction = await updateRecurrentTransaction({
    oldTransaction,
    updatedTransaction,
    newIsRecurrent: isRecurrent,
    newFrequency: frequency,
  })
  if (!!updatedRecurrentTransaction) {
    updatedTransaction.isRecurrent = true
    updatedTransaction.frequency = updatedRecurrentTransaction.frequency
  }

  return updatedTransaction
}
