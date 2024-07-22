import { TransactionFrequency } from "@/src/transactions/types"

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
