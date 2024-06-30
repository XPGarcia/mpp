export const adjustTimezone = (date: Date) => {
  const parsedDate = new Date(date)
  const offset = parsedDate.getTimezoneOffset()
  const newDate = new Date(parsedDate.getTime() + offset * 60 * 1000)
  return newDate
}
