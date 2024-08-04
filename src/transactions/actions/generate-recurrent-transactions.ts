import dayjs from "dayjs"
import { TransactionRepository } from "../repositories/transaction-repository"
import { RecurrentTransaction, Transaction } from "../types"
import { createTransactionFromRecurrent } from "./create-transaction-from-recurrent"

const createTransactionsFromRecurrent = async (
  recurrentTransactions: RecurrentTransaction[]
): Promise<Transaction[]> => {
  if (recurrentTransactions.length === 0) {
    return []
  }

  const newTransactionsResponse = await Promise.allSettled(
    recurrentTransactions.map(async (recurrentTransaction) => {
      return await createTransactionFromRecurrent(recurrentTransaction)
    })
  )

  const createdTransactions: Transaction[] = []
  for (const response of newTransactionsResponse) {
    if (response.status === "rejected") {
      console.error("Failed to create transaction from recurrent", { response })
      continue
    }
    createdTransactions.push(response.value)
  }

  return createdTransactions
}

const executeForDailyTransactions = async (): Promise<Transaction[]> => {
  const recurrentTransactions = await TransactionRepository.findAllDailyRecurrentForToday()
  return await createTransactionsFromRecurrent(recurrentTransactions)
}

const executeForWeeklyTransactions = async (): Promise<Transaction[]> => {
  const recurrentTransactions = await TransactionRepository.findAllWeeklyRecurrentForThisWeek()
  return await createTransactionsFromRecurrent(recurrentTransactions)
}

const executeForMonthlyTransactions = async (): Promise<Transaction[]> => {
  const recurrentTransactions = await TransactionRepository.findAllMonthlyRecurrentForThisWeek()
  return await createTransactionsFromRecurrent(recurrentTransactions)
}

export const generateRecurrentTransactions = async () => {
  const updatedTransactions: Transaction[] = []
  const newDailyTransactions = await executeForDailyTransactions()
  updatedTransactions.push(...newDailyTransactions)

  const today = dayjs().startOf("day")
  const startOfWeek = dayjs().startOf("week")
  const startOfMonth = dayjs().startOf("month")

  const isTodayStartOfWeek = today.isSame(startOfWeek, "day")
  if (isTodayStartOfWeek) {
    const newWeeklyTransactions = await executeForWeeklyTransactions()
    updatedTransactions.push(...newWeeklyTransactions)
  }

  const isTodayStartOfMonth = today.isSame(startOfMonth, "day")
  if (isTodayStartOfMonth) {
    const newMonthlyTransactions = await executeForMonthlyTransactions()
    updatedTransactions.push(...newMonthlyTransactions)
  }

  return updatedTransactions
}
