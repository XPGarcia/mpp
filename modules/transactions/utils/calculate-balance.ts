import { Transaction } from "@/modules/transactions/domain"
import { isExpense, isIncome } from "@/utils"

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
