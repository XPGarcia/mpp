import { SpendingType } from "@/modules/transactions/types"

export const isNecessity = (spendingType: SpendingType) => {
  return spendingType === SpendingType.NECESSITY
}

export const isLuxury = (spendingType: SpendingType) => {
  return spendingType === SpendingType.LUXURY
}

export const isSavings = (spendingType: SpendingType) => {
  return spendingType === SpendingType.SAVINGS
}
