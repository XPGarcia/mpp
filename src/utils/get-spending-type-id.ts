import { SpendingType } from "../transactions/types"

const SpendingTypeMapper: Record<SpendingType, number> = {
  NO_APPLY: 1,
  NECESSITY: 2,
  LUXURY: 3,
  SAVINGS: 4,
}

export const getSPendingTypeId = (type: SpendingType) => {
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

export const isNecessity = (spendingType: SpendingType) => {
  return spendingType === SpendingType.NECESSITY
}

export const isLuxury = (spendingType: SpendingType) => {
  return spendingType === SpendingType.LUXURY
}

export const isSavings = (spendingType: SpendingType) => {
  return spendingType === SpendingType.SAVINGS
}
