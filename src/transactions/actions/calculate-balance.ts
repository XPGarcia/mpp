import { isExpense, isIncome } from "@/src/utils/get-transaction-type-id"
import { Transaction } from "../types"

export const calculateBalance = (transactions: Transaction[]) => {
  let income = 0
  let expenses = 0
  for (const transaction of transactions) {
    if (isIncome(transaction.type)) {
      income += transaction.amount
    } else if (isExpense(transaction.type)) {
      expenses += transaction.amount
    }
  }
  const total = income - expenses
  return { income, expenses, total }
}
