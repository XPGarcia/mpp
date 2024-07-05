import { SpendingType, TransactionType } from "@/src/transactions/types"

export type Category = {
  id: number
  name: string
  transactionType: TransactionType
  spendingType: SpendingType
}
