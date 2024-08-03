import dayjs from "dayjs"

export const adjustTimezoneFromUTCToLocal = (date: Date): Date => {
  const parsedDate = dayjs(date)
  const offset = parsedDate.utcOffset()
  const adjustedDate = parsedDate.add(offset, "minute").toDate()
  return adjustedDate
}

export const adjustTimezoneFromLocalToUTC = (date: Date): Date => {
  const parsedDate = dayjs(date)
  const offset = parsedDate.utcOffset()
  const adjustedDate = parsedDate.add(offset * -1, "minute").toDate()
  return adjustedDate
}
