import { TransactionType } from "../transactions/types"

const TransactionTypeMapper: Record<TransactionType, number> = {
  INCOME: 1,
  EXPENSE: 2,
}

export const getTransactionTypeId = (type: TransactionType) => {
  return TransactionTypeMapper[type]
}

export const getTransactionTypeFromId = (typeId: number) => {
  const transaction = Object.keys(TransactionTypeMapper).find(
    (key) => TransactionTypeMapper[key as TransactionType] === typeId
  )
  if (!transaction) {
    console.error(`Transaction type with id ${typeId} not found`)
    throw new Error("Transaction type not found")
  }
  return transaction as TransactionType
}

export const isIncome = (transactionType: TransactionType) => {
  return transactionType === TransactionType.INCOME
}

export const isExpense = (transactionType: TransactionType) => {
  return transactionType === TransactionType.EXPENSE
}
