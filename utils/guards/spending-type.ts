const SpendingType = {
  NECESSITY: "NECESSITY",
  LUXURY: "LUXURY",
  SAVINGS: "SAVINGS",
  NO_APPLY: "NO_APPLY",
} as const
type SpendingType = (typeof SpendingType)[keyof typeof SpendingType]

export const isNecessity = (spendingType: SpendingType) => {
  return spendingType === SpendingType.NECESSITY
}

export const isLuxury = (spendingType: SpendingType) => {
  return spendingType === SpendingType.LUXURY
}

export const isSavings = (spendingType: SpendingType) => {
  return spendingType === SpendingType.SAVINGS
}
