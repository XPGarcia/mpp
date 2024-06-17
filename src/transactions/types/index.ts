export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export type Transaction = {
  id: number
  date: Date
  amount: number
  typeId: number
  categoryId: number
  description?: string | null
}
