import { TransactionType } from "../transactions/types"

const TransactionTypeMapper: Record<TransactionType, number> = {
  INCOME: 1,
  EXPENSE: 2,
}

export const getTransactionTypeId = (type: TransactionType) => {
  return TransactionTypeMapper[type]
}
