import { TransactionFrequency } from "../types"
import dayjs from "dayjs"

export const calculateNextTransactionDate = (startDate: Date, frequency: TransactionFrequency): Date => {
  const mapperToDayJs: Record<TransactionFrequency, dayjs.ManipulateType> = {
    [TransactionFrequency.DAILY]: "day",
    [TransactionFrequency.WEEKLY]: "week",
    [TransactionFrequency.MONTHLY]: "month",
    [TransactionFrequency.YEARLY]: "year",
  }

  const nextDate = dayjs(startDate)
  return nextDate.add(1, mapperToDayJs[frequency]).toDate()
}
