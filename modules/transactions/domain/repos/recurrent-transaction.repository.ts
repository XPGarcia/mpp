import { RecurrentTransaction, TimeUnit, TransactionFrequency } from "../entities"
import { CreateTransactionInput } from "./transaction.repository"

export interface RecurrentTransactionRepository {
  createOne(input: CreateRecurrentTransactionInput): Promise<RecurrentTransaction | undefined>
  findOneById(id: number, options?: FindOneRecurrentByIdOptions): Promise<RecurrentTransaction | undefined>
  deleteOneById(id: number): Promise<void>
  updateRecurrent(id: number, input: UpdateRecurrentTransactionInput): Promise<RecurrentTransaction | undefined>
  findManyRecurrentByRangeAndFrequency(input: {
    fromDate: Date
    toDate: Date
    frequency: TransactionFrequency
  }): Promise<RecurrentTransaction[]>
  findAllRecurrentForPeriod(timeUnit: TimeUnit): Promise<RecurrentTransaction[]>
  findManyByUser(userId: number): Promise<RecurrentTransaction[]>
}

export type CreateRecurrentTransactionInput = Pick<
  CreateTransactionInput,
  "userId" | "categoryId" | "accountId" | "amount" | "description" | "date" | "type"
> & {
  startDate: Date
  nextDate: Date
  id?: number | undefined
  createdAt?: Date | undefined
  updatedAt?: Date | undefined
  frequency: TransactionFrequency
}

export type UpdateRecurrentTransactionInput = Partial<CreateRecurrentTransactionInput>

export type FindOneRecurrentByIdOptions = {
  withTransactions?: boolean
}
