import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"
import { TransactionRepository } from "../repositories/transaction-repository"
import { TransactionType } from "../types"
import { getAccountBalanceEntryByDate } from "@/src/accounts/actions/get-account-balance-entry-by-date"
import { updateAmountAccountBalanceEntry } from "@/src/accounts/actions/update-amount-account-balance-entry"
import { calculateAmountForBalance } from "./calculate-amount-for-balance"

interface UpdateTransactionInput {
  id: number
  date: Date
  amount?: number
  categoryId?: number
  type?: TransactionType
  description?: string
}

export const updateTransaction = async (input: UpdateTransactionInput) => {
  const { id, ...data } = input
  const oldTransaction = await TransactionRepository.findOneById(id)
  if (!oldTransaction) {
    throw new Error("Transaction not found")
  }

  const accountBalanceEntry = await getAccountBalanceEntryByDate({ userId: oldTransaction.userId, date: input.date })

  const updatedTransaction = await TransactionRepository.updateOne(oldTransaction.id, data)
  if (!updatedTransaction) {
    throw new Error("Failed to create transaction")
  }

  const amount = calculateAmountForBalance(oldTransaction, updatedTransaction)
  await updateAmountAccountBalanceEntry({ accountBalanceEntry, amount })

  return updatedTransaction
}
