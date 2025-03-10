import { SpendingType, TransactionType } from "./transaction"

export type Category = {
  id: number
  name: string
  transactionType: TransactionType
  spendingType: SpendingType
}

export type WithSpend<T> = T & {
  totalSpend: number
}
