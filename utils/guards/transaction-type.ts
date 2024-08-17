import { TransactionType } from "@/modules/transactions/types"

export const isIncome = (transactionType: TransactionType) => {
  return transactionType === TransactionType.INCOME
}

export const isExpense = (transactionType: TransactionType) => {
  return transactionType === TransactionType.EXPENSE
}
