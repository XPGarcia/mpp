import { Transaction } from "@/modules/transactions/domain"
import { InternalServerError } from "@/src/utils/errors/errors"
import { isExpense, isIncome } from "@/utils"

const NEGATIVE = -1
const POSITIVE = 1

export const calculateAmountFromExpenseToExpense = (oldAmount: number, newAmount: number) => {
  const deltaAmount = Math.abs(oldAmount - newAmount)
  const oldAmountIsLower = oldAmount < newAmount
  const amountPolarity = oldAmountIsLower ? NEGATIVE : POSITIVE
  return deltaAmount * amountPolarity
}

export const calculateAmountFromIncomeToIncome = (oldAmount: number, newAmount: number) => {
  const deltaAmount = Math.abs(oldAmount - newAmount)
  const newAmountIsLower = newAmount < oldAmount
  const amountPolarity = newAmountIsLower ? NEGATIVE : POSITIVE
  return deltaAmount * amountPolarity
}

export const calculateAmountFromExpenseToIncome = (oldAmount: number, newAmount: number) => {
  const deltaAmount = Math.abs(oldAmount) + Math.abs(newAmount)
  return deltaAmount * POSITIVE
}

export const calculateAmountFromIncomeToExpense = (oldAmount: number, newAmount: number) => {
  const deltaAmount = Math.abs(oldAmount) + Math.abs(newAmount)
  return deltaAmount * NEGATIVE
}

export const calculateAmountForBalance = (oldTransaction: Transaction, updatedTransaction: Transaction) => {
  const fromExpenseToExpense = isExpense(oldTransaction.type) && isExpense(updatedTransaction.type)
  const fromIncomeToIncome = isIncome(oldTransaction.type) && isIncome(updatedTransaction.type)
  const fromExpenseToIncome = isExpense(oldTransaction.type) && isIncome(updatedTransaction.type)
  const fromIncomeToExpense = isIncome(oldTransaction.type) && isExpense(updatedTransaction.type)

  if (fromExpenseToExpense) {
    return calculateAmountFromExpenseToExpense(oldTransaction.amount, updatedTransaction.amount)
  } else if (fromIncomeToIncome) {
    return calculateAmountFromIncomeToIncome(oldTransaction.amount, updatedTransaction.amount)
  } else if (fromExpenseToIncome) {
    return calculateAmountFromExpenseToIncome(oldTransaction.amount, updatedTransaction.amount)
  } else if (fromIncomeToExpense) {
    return calculateAmountFromIncomeToExpense(oldTransaction.amount, updatedTransaction.amount)
  }

  console.error("Failed to calculate amount for balance", { oldTransaction, updatedTransaction })
  throw new InternalServerError("Failed to calculate amount for balance")
}
