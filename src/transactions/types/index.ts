import { Category } from "@/src/categories/types"

export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export const transactionTypeOptions: { value: TransactionType; label: string }[] = [
  { value: TransactionType.INCOME, label: "Income" },
  { value: TransactionType.EXPENSE, label: "Expense" },
]

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

export const transactionFrequencyOptions: { value: TransactionFrequency; label: string }[] = [
  { value: TransactionFrequency.DAILY, label: "Daily" },
  { value: TransactionFrequency.WEEKLY, label: "Weekly" },
  { value: TransactionFrequency.MONTHLY, label: "Monthly" },
  { value: TransactionFrequency.YEARLY, label: "Yearly" },
]

export const SpendingTypeToLabel: Record<SpendingType, string> = {
  NECESSITY: "Need for Living",
  LUXURY: "Entertainment",
  SAVINGS: "Savings and Investments",
  NO_APPLY: "No Apply",
}

export const spendingTypeOptions: { value: SpendingType; label: string }[] = [
  { value: SpendingType.NECESSITY, label: SpendingTypeToLabel.NECESSITY },
  { value: SpendingType.LUXURY, label: SpendingTypeToLabel.LUXURY },
  { value: SpendingType.SAVINGS, label: SpendingTypeToLabel.SAVINGS },
]

export interface Transaction {
  id: number
  userId: number
  date: Date
  amount: number
  type: TransactionType
  categoryId: number
  category?: Category
  description?: string
  accountId: number
  isRecurrent: boolean
  frequency?: TransactionFrequency
}

export interface RecurrentTransaction {
  id: number
  transactionId: number
  frequency: TransactionFrequency
  startDate: Date
  nextDate: Date
}
