import { Category } from "./category"

export type TimeUnit = "day" | "week" | "month"

export type Transaction = {
  id: number
  userId: number
  date: Date
  amount: number
  type: TransactionType
  categoryId: number
  category?: Category
  description?: string
  accountId: number
  account?: {
    id: number
    name: string
  }
  recurrentTransactionId?: number
}

export type RecurrentTransaction = Pick<
  Transaction,
  "userId" | "date" | "amount" | "type" | "categoryId" | "description" | "accountId" | "category" | "account"
> & {
  id: number
  frequency: TransactionFrequency
  startDate: Date
  nextDate: Date
  transactions?: Transaction[]
}

export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export const SpendingType = {
  NECESSITY: "NECESSITY",
  LUXURY: "LUXURY",
  SAVINGS: "SAVINGS",
  NO_APPLY: "NO_APPLY",
} as const
export type SpendingType = (typeof SpendingType)[keyof typeof SpendingType]

export const TransactionFrequency = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const
export type TransactionFrequency = (typeof TransactionFrequency)[keyof typeof TransactionFrequency]
