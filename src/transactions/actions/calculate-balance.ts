import { Transaction } from "../types"

export const calculateBalance = (transactions: Transaction[]) => {
  let income = 0
  let expenses = 0
  for (const transaction of transactions) {
    if (transaction.type === "INCOME") {
      income += transaction.amount
    } else if (transaction.type === "EXPENSE") {
      expenses += transaction.amount
    }
  }
  const total = income - expenses
  return { income, expenses, total }
}
