import { RecurrentTransaction, TransactionFrequency } from "../entities"

export interface RecurrentTransactionRepository {
  createOne(input: CreateRecurrentTransactionInput): Promise<RecurrentTransaction | undefined>
  findRecurrentByParentId(parentId: number): Promise<RecurrentTransaction | undefined>
  deleteRecurrentByParentId(parentId: number): Promise<void>
  updateRecurrent(id: number, input: UpdateRecurrentTransactionInput): Promise<RecurrentTransaction | undefined>
  findManyRecurrentByRangeAndFrequency(input: {
    fromDate: Date
    toDate: Date
    frequency: TransactionFrequency
  }): Promise<RecurrentTransaction[]>
  findAllDailyRecurrentForToday(): Promise<RecurrentTransaction[]>
  findAllWeeklyRecurrentForThisWeek(): Promise<RecurrentTransaction[]>
  findAllMonthlyRecurrentForThisMonth(): Promise<RecurrentTransaction[]>
}

export type CreateRecurrentTransactionInput = {
  transactionId: number
  startDate: Date
  nextDate: Date
  id?: number | undefined
  createdAt?: Date | undefined
  updatedAt?: Date | undefined
  frequency: TransactionFrequency
}

export type UpdateRecurrentTransactionInput = Partial<CreateRecurrentTransactionInput>
