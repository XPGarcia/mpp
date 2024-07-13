import { getTransactionTypeId, isIncome } from "@/src/utils/get-transaction-type-id"
import { TransactionRepository } from "../repositories/transaction-repository"
import { TransactionType } from "../types"
import { getAccountBalanceEntryByDate } from "@/src/accounts/actions/get-account-balance-entry-by-date"
import { updateAmountAccountBalanceEntry } from "@/src/accounts/actions/update-amount-account-balance-entry"

interface CreateTransactionInput {
  userId: number
  date: Date
  amount: number
  categoryId: number
  type: TransactionType
  description?: string
}

export const createTransaction = async (input: CreateTransactionInput) => {
  const accountBalanceEntry = await getAccountBalanceEntryByDate({ userId: input.userId, date: input.date })

  const createdTransaction = await TransactionRepository.createOne({
    ...input,
    accountId: accountBalanceEntry.accountId,
  })
  if (!createdTransaction) {
    throw new Error("Failed to create transaction")
  }

  const amount = isIncome(createdTransaction.type) ? createdTransaction.amount : createdTransaction.amount * -1
  await updateAmountAccountBalanceEntry({ accountBalanceEntry, amount })

  return createdTransaction
}
