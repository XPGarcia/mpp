import dayjs from "dayjs"
import { RecurrentTransaction, RecurrentTransactionRepository, Transaction } from "@/modules/transactions/domain"
import { inject, injectable } from "inversify"
import { TYPES } from "@/modules/container/types"
import { CreateTransactionFromRecurrent } from "./create-transaction-from-recurrent"

const createTransactionsFromRecurrent = async (
  recurrentTransactions: RecurrentTransaction[],
  createTransactionFromRecurrent: CreateTransactionFromRecurrent
): Promise<Transaction[]> => {
  if (recurrentTransactions.length === 0) {
    return []
  }

  const newTransactionsResponse = await Promise.allSettled(
    recurrentTransactions.map(async (recurrentTransaction) => {
      return await createTransactionFromRecurrent.execute(recurrentTransaction)
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

const executeForDailyTransactions = async (
  recurrentTransactionRepo: RecurrentTransactionRepository,
  createTransactionFromRecurrent: CreateTransactionFromRecurrent
): Promise<Transaction[]> => {
  const recurrentTransactions = await recurrentTransactionRepo.findAllDailyRecurrentForToday()
  return await createTransactionsFromRecurrent(recurrentTransactions, createTransactionFromRecurrent)
}

const executeForWeeklyTransactions = async (
  recurrentTransactionRepo: RecurrentTransactionRepository,
  createTransactionFromRecurrent: CreateTransactionFromRecurrent
): Promise<Transaction[]> => {
  const recurrentTransactions = await recurrentTransactionRepo.findAllWeeklyRecurrentForThisWeek()
  return await createTransactionsFromRecurrent(recurrentTransactions, createTransactionFromRecurrent)
}

const executeForMonthlyTransactions = async (
  recurrentTransactionRepo: RecurrentTransactionRepository,
  createTransactionFromRecurrent: CreateTransactionFromRecurrent
): Promise<Transaction[]> => {
  const recurrentTransactions = await recurrentTransactionRepo.findAllMonthlyRecurrentForThisWeek()
  return await createTransactionsFromRecurrent(recurrentTransactions, createTransactionFromRecurrent)
}

export type GenerateRecurrentTransactionsOutput = Promise<Transaction[]>

export interface GenerateRecurrentTransactionsUseCase {
  execute(): GenerateRecurrentTransactionsOutput
}

@injectable()
export class GenerateRecurrentTransactions implements GenerateRecurrentTransactionsUseCase {
  @inject(TYPES.RecurrentTransactionRepository)
  private readonly _recurrentTransactionRepo!: RecurrentTransactionRepository
  @inject(TYPES.CreateTransactionFromRecurrent)
  private readonly _createTransactionFromRecurrent!: CreateTransactionFromRecurrent

  async execute(): GenerateRecurrentTransactionsOutput {
    const updatedTransactions: Transaction[] = []
    const newDailyTransactions = await executeForDailyTransactions(
      this._recurrentTransactionRepo,
      this._createTransactionFromRecurrent
    )
    updatedTransactions.push(...newDailyTransactions)

    const today = dayjs().startOf("day")
    const startOfWeek = dayjs().startOf("week")
    const startOfMonth = dayjs().startOf("month")

    const isTodayStartOfWeek = today.isSame(startOfWeek, "day")
    if (isTodayStartOfWeek) {
      const newWeeklyTransactions = await executeForWeeklyTransactions(
        this._recurrentTransactionRepo,
        this._createTransactionFromRecurrent
      )
      updatedTransactions.push(...newWeeklyTransactions)
    }

    const isTodayStartOfMonth = today.isSame(startOfMonth, "day")
    if (isTodayStartOfMonth) {
      const newMonthlyTransactions = await executeForMonthlyTransactions(
        this._recurrentTransactionRepo,
        this._createTransactionFromRecurrent
      )
      updatedTransactions.push(...newMonthlyTransactions)
    }

    return updatedTransactions
  }
}
