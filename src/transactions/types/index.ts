import { Category } from "@/src/categories/types"

export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export type Transaction = {
  id: number
  date: Date
  amount: number
  type: TransactionType
  categoryId: number
  category?: Category
  description?: string | null
}
