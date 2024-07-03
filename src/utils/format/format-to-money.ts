export const formatNumberToMoney = (value?: number) => {
  if (value === undefined) {
    return
  }
  return `$${value.toFixed(2)}`
}
