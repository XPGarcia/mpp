export const formatNumberToMoney = (value?: number) => {
  if (!value) {
    return
  }
  return `$${value.toFixed(2)}`
}
