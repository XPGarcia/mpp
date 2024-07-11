export const calculatePercentage = (total: number, amount: number) => {
  const percentage = (total * amount) / 100
  return Math.round(percentage)
}

export const calculatePercentageFromTotal = (total: number, amount: number) => {
  const percentage = (amount * 100) / total
  return Math.round(percentage)
}
