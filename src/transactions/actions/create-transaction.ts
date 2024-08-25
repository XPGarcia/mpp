import { isIncome } from "@/src/utils/get-transaction-type-id"
import { TransactionRepository } from "../repositories/transaction-repository"
import { TransactionFrequency, TransactionType } from "../types"
import { accountsClient } from "@/modules/accounts"

interface CreateTransactionInput {
  userId: number
  date: Date
  amount: number
  categoryId: number
  type: TransactionType
  description?: string
  isRecurrent: boolean
  frequency?: TransactionFrequency
}

export const createTransaction = async (input: CreateTransactionInput) => {
  const accountBalanceEntry = await accountsClient.getAccountBalanceEntryByDate({
    userId: input.userId,
    date: input.date,
  })

  const createdTransaction = await TransactionRepository.createOne({
    ...input,
    accountId: accountBalanceEntry.accountId,
  })
  if (!createdTransaction) {
    throw new Error("Failed to create transaction")
  }

  const amount = isIncome(createdTransaction.type) ? createdTransaction.amount : createdTransaction.amount * -1
  await accountsClient.updateBalance({ accountBalanceEntry, amount })

  return createdTransaction
}
