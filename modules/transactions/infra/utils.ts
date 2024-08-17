import { SpendingType, TransactionFrequency, TransactionType } from "@/modules/transactions/domain"

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

const SpendingTypeMapper: Record<SpendingType, number> = {
  NO_APPLY: 1,
  NECESSITY: 2,
  LUXURY: 3,
  SAVINGS: 4,
}

export const getSpendingTypeId = (type: SpendingType) => {
  return SpendingTypeMapper[type]
}

export const getSpendingTypeFromId = (typeId: number) => {
  const spendingType = Object.keys(SpendingTypeMapper).find((key) => SpendingTypeMapper[key as SpendingType] === typeId)
  if (!spendingType) {
    console.error(`Spending type with id ${typeId} not found`)
    throw new Error("Spending type not found")
  }
  return spendingType as SpendingType
}

export const TransactionFrequencyMapper = {
  DAILY: 1,
  WEEKLY: 2,
  MONTHLY: 3,
  YEARLY: 4,
}

export const getTransactionFrequencyId = (frequency: TransactionFrequency) => {
  return TransactionFrequencyMapper[frequency]
}

export const getTransactionFrequencyFromId = (frequencyId: number) => {
  const frequency = Object.keys(TransactionFrequencyMapper).find(
    (key) => TransactionFrequencyMapper[key as TransactionFrequency] === frequencyId
  )
  if (!frequency) {
    console.error(`Transaction frequency with id ${frequencyId} not found`)
    throw new Error("Transaction frequency not found")
  }
  return frequency as TransactionFrequency
}
