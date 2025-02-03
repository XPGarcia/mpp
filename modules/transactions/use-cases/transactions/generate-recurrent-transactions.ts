import dayjs from "dayjs"
import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { RecurrentTransaction, RecurrentTransactionRepository, Transaction } from "@/modules/transactions/domain"

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
    const recurrentDailyTransactions = await this._recurrentTransactionRepo.findAllRecurrentForPeriod("day")
    const newDailyTransactions = await createTransactionsFromRecurrent(
      recurrentDailyTransactions,
      this._createTransactionFromRecurrent
    )
    updatedTransactions.push(...newDailyTransactions)

    const today = dayjs().startOf("day")
    const startOfWeek = dayjs().startOf("week")
    const startOfMonth = dayjs().startOf("month")

    const isTodayStartOfWeek = today.isSame(startOfWeek, "day")
    if (isTodayStartOfWeek) {
      const recurrentWeeklyTransactions = await this._recurrentTransactionRepo.findAllRecurrentForPeriod("week")
      const newWeeklyTransactions = await createTransactionsFromRecurrent(
        recurrentWeeklyTransactions,
        this._createTransactionFromRecurrent
      )
      updatedTransactions.push(...newWeeklyTransactions)
    }

    const isTodayStartOfMonth = today.isSame(startOfMonth, "day")
    if (isTodayStartOfMonth) {
      const recurrentMonthlyTransactions = await this._recurrentTransactionRepo.findAllRecurrentForPeriod("month")
      const newMonthlyTransactions = await createTransactionsFromRecurrent(
        recurrentMonthlyTransactions,
        this._createTransactionFromRecurrent
      )
      updatedTransactions.push(...newMonthlyTransactions)
    }

    return updatedTransactions
  }
}
