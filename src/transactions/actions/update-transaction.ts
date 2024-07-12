import { getTransactionTypeId, isExpense, isIncome } from "@/src/utils/get-transaction-type-id"
import { TransactionRepository } from "../repositories/transaction-repository"
import { Transaction, TransactionType } from "../types"
import { getAccountBalanceEntryByDate } from "@/src/accounts/actions/get-account-balance-entry-by-date"
import { updateAmountAccountBalanceEntry } from "@/src/accounts/actions/update-amount-account-balance-entry"
import { InternalServerError } from "@/src/utils/errors/errors"

interface UpdateTransactionInput {
  id: number
  date: Date
  amount?: number
  categoryId?: number
  type?: TransactionType
  description?: string
}

const NEGATIVE = -1
const POSITIVE = 1

const calculateAmountFromExpenseToExpense = (oldTransaction: Transaction, updatedTransaction: Transaction) => {
  const deltaAmount = Math.abs(oldTransaction.amount - updatedTransaction.amount)
  const oldAmountIsLower = oldTransaction.amount < updatedTransaction.amount
  const amountPolarity = oldAmountIsLower ? NEGATIVE : POSITIVE
  return deltaAmount * amountPolarity
}

const calculateAmountFromIncomeToIncome = (oldTransaction: Transaction, updatedTransaction: Transaction) => {
  const deltaAmount = Math.abs(oldTransaction.amount - updatedTransaction.amount)
  const newAmountIsLower = updatedTransaction.amount < oldTransaction.amount
  const amountPolarity = newAmountIsLower ? NEGATIVE : POSITIVE
  return deltaAmount * amountPolarity
}

const calculateAmountFrommExpenseToIncome = (oldTransaction: Transaction, updatedTransaction: Transaction) => {
  const deltaAmount = Math.abs(oldTransaction.amount) + Math.abs(updatedTransaction.amount)
  return deltaAmount * POSITIVE
}

const calculateAmountFromIncomeToExpense = (oldTransaction: Transaction, updatedTransaction: Transaction) => {
  const deltaAmount = Math.abs(oldTransaction.amount) + Math.abs(updatedTransaction.amount)
  return deltaAmount * NEGATIVE
}

const calculateAmountForBalance = (oldTransaction: Transaction, updatedTransaction: Transaction) => {
  const fromExpenseToExpense = isExpense(oldTransaction.type) && isExpense(updatedTransaction.type)
  const fromIncomeToIncome = isIncome(oldTransaction.type) && isIncome(updatedTransaction.type)
  const fromExpenseToIncome = isExpense(oldTransaction.type) && isIncome(updatedTransaction.type)
  const fromIncomeToExpense = isIncome(oldTransaction.type) && isExpense(updatedTransaction.type)

  if (fromExpenseToExpense) {
    return calculateAmountFromExpenseToExpense(oldTransaction, updatedTransaction)
  } else if (fromIncomeToIncome) {
    return calculateAmountFromIncomeToIncome(oldTransaction, updatedTransaction)
  } else if (fromExpenseToIncome) {
    return calculateAmountFrommExpenseToIncome(oldTransaction, updatedTransaction)
  } else if (fromIncomeToExpense) {
    return calculateAmountFromIncomeToExpense(oldTransaction, updatedTransaction)
  }

  console.error("Failed to calculate amount for balance", { oldTransaction, updatedTransaction })
  throw new InternalServerError("Failed to calculate amount for balance")
}

export const updateTransaction = async (input: UpdateTransactionInput) => {
  const { id, ...data } = input
  const oldTransaction = await TransactionRepository.findOneById(id)
  if (!oldTransaction) {
    throw new Error("Transaction not found")
  }

  const accountBalanceEntry = await getAccountBalanceEntryByDate({ userId: oldTransaction.userId, date: input.date })

  const typeId = data.type ? getTransactionTypeId(data.type) : undefined
  const updatedTransaction = await TransactionRepository.updateOne(oldTransaction.id, { ...data, typeId })
  if (!updatedTransaction) {
    throw new Error("Failed to create transaction")
  }

  const amount = calculateAmountForBalance(oldTransaction, updatedTransaction)
  await updateAmountAccountBalanceEntry({ accountBalanceEntry, amount })

  return updatedTransaction
}
