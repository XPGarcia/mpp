export const formatNumberToMoney = (value?: number) => {
  if (value === undefined) {
    return
  }
  const isPositive = value >= 0
  const absValue = Math.abs(value)
  return isPositive ? `$${absValue.toFixed(2)}` : `-$${absValue.toFixed(2)}`
}
