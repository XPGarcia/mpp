import { SpendingType, TransactionFrequency, TransactionType } from "@/modules/transactions/types"

export const transactionTypeOptions: { value: TransactionType; label: string }[] = [
  { value: TransactionType.INCOME, label: "Income" },
  { value: TransactionType.EXPENSE, label: "Expense" },
]

export const transactionFrequencyOptions: { value: TransactionFrequency; label: string }[] = [
  { value: TransactionFrequency.DAILY, label: "Daily" },
  { value: TransactionFrequency.WEEKLY, label: "Weekly" },
  { value: TransactionFrequency.MONTHLY, label: "Monthly" },
  { value: TransactionFrequency.YEARLY, label: "Yearly" },
]

export const SpendingTypeToLabel: Record<SpendingType, string> = {
  NECESSITY: "Need for Living",
  LUXURY: "Entertainment and Luxury",
  SAVINGS: "Savings and Investments",
  NO_APPLY: "No Apply",
}

export const spendingTypeOptions: { value: SpendingType; label: string }[] = [
  { value: SpendingType.NECESSITY, label: SpendingTypeToLabel.NECESSITY },
  { value: SpendingType.LUXURY, label: SpendingTypeToLabel.LUXURY },
  { value: SpendingType.SAVINGS, label: SpendingTypeToLabel.SAVINGS },
]
