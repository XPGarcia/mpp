const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const
type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export const isIncome = (transactionType: TransactionType) => {
  return transactionType === TransactionType.INCOME
}

export const isExpense = (transactionType: TransactionType) => {
  return transactionType === TransactionType.EXPENSE
}
