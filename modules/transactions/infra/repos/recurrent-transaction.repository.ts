import { injectable } from "inversify"
import {
  CreateRecurrentTransactionInput,
  RecurrentTransaction,
  RecurrentTransactionRepository,
  TimeUnit,
  TransactionFrequency,
  UpdateRecurrentTransactionInput,
} from "@/modules/transactions/domain"
import { recurrentTransactions } from "@/db/schema"
import { db } from "@/db"
import { and, eq, gte, lt } from "drizzle-orm"
import dayjs from "dayjs"
import { RecurrentTransactionMapper } from "../mappers"
import { getTransactionFrequencyId } from "../utils"

@injectable()
export class DrizzleRecurrentTransactionRepository implements RecurrentTransactionRepository {
  async createOne(input: CreateRecurrentTransactionInput): Promise<RecurrentTransaction | undefined> {
    const frequencyId = getTransactionFrequencyId(input.frequency)
    const createdRows = await db
      .insert(recurrentTransactions)
      .values({ ...input, frequencyId })
      .returning()
    return RecurrentTransactionMapper.toDomain(createdRows[0])
  }

  async findRecurrentByParentId(parentId: number): Promise<RecurrentTransaction | undefined> {
    const recurrentTransaction = await db.query.recurrentTransactions.findFirst({
      where: eq(recurrentTransactions.transactionId, parentId),
    })
    if (!recurrentTransaction) {
      return
    }
    return RecurrentTransactionMapper.toDomain(recurrentTransaction)
  }

  async deleteRecurrentByParentId(parentId: number): Promise<void> {
    await db.delete(recurrentTransactions).where(eq(recurrentTransactions.transactionId, parentId))
  }

  async updateRecurrent(id: number, input: UpdateRecurrentTransactionInput): Promise<RecurrentTransaction | undefined> {
    const frequencyId = !!input.frequency ? getTransactionFrequencyId(input.frequency) : undefined
    const toUpdateValues = { ...input, frequencyId }
    if (!frequencyId) {
      delete toUpdateValues.frequencyId
    }

    const updatedRecurrentTransaction = await db
      .update(recurrentTransactions)
      .set(toUpdateValues)
      .where(eq(recurrentTransactions.id, id))
      .returning()
    return RecurrentTransactionMapper.toDomain(updatedRecurrentTransaction[0])
  }

  async findManyRecurrentByRangeAndFrequency(input: {
    fromDate: Date
    toDate: Date
    frequency: TransactionFrequency
  }): Promise<RecurrentTransaction[]> {
    const rows = await db
      .select()
      .from(recurrentTransactions)
      .where(
        and(
          gte(recurrentTransactions.nextDate, input.fromDate),
          lt(recurrentTransactions.nextDate, input.toDate),
          eq(recurrentTransactions.frequencyId, getTransactionFrequencyId(input.frequency))
        )
      )
    return RecurrentTransactionMapper.toDomains(rows)
  }

  async findAllRecurrentForPeriod(timeUnit: TimeUnit): Promise<RecurrentTransaction[]> {
    const frequencyMapper: Record<TimeUnit, TransactionFrequency> = {
      day: TransactionFrequency.DAILY,
      week: TransactionFrequency.WEEKLY,
      month: TransactionFrequency.MONTHLY,
    }
    const startOfPeriod = dayjs().startOf(timeUnit).toDate()
    const endOfPeriod = dayjs().endOf(timeUnit).toDate()
    return this.findManyRecurrentByRangeAndFrequency({
      fromDate: startOfPeriod,
      toDate: endOfPeriod,
      frequency: frequencyMapper[timeUnit],
    })
  }
}
