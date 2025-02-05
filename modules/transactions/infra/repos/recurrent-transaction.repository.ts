import dayjs from "dayjs"
import { and, desc, eq, gte, lt } from "drizzle-orm"
import { injectable } from "inversify"

import { db } from "@/db"
import { categories, recurrentTransactions } from "@/db/schema"
import {
  CreateRecurrentTransactionInput,
  FindOneRecurrentByIdOptions,
  RecurrentTransaction,
  RecurrentTransactionRepository,
  TimeUnit,
  TransactionFrequency,
  UpdateRecurrentTransactionInput,
} from "@/modules/transactions/domain"

import { RecurrentTransactionMapper } from "../mappers"
import { getTransactionFrequencyId, getTransactionTypeId } from "../utils"

@injectable()
export class DrizzleRecurrentTransactionRepository implements RecurrentTransactionRepository {
  async createOne(input: CreateRecurrentTransactionInput): Promise<RecurrentTransaction | undefined> {
    const typeId = getTransactionTypeId(input.type)
    const frequencyId = getTransactionFrequencyId(input.frequency)
    const createdRows = await db
      .insert(recurrentTransactions)
      .values({ ...input, typeId, frequencyId })
      .returning()
    return RecurrentTransactionMapper.toDomain(createdRows[0])
  }

  async findOneById(id: number, options?: FindOneRecurrentByIdOptions): Promise<RecurrentTransaction | undefined> {
    const recurrentTransaction = await db.query.recurrentTransactions.findFirst({
      with: { category: true, account: true, transactions: Boolean(options?.withTransactions) ? true : undefined },
      where: eq(recurrentTransactions.id, id),
    })
    return RecurrentTransactionMapper.toDomain(recurrentTransaction)
  }

  async deleteOneById(id: number): Promise<void> {
    await db.delete(recurrentTransactions).where(eq(recurrentTransactions.id, id))
  }

  async updateRecurrent(id: number, input: UpdateRecurrentTransactionInput): Promise<RecurrentTransaction | undefined> {
    const frequencyId = !!input.frequency ? getTransactionFrequencyId(input.frequency) : undefined
    const typeId = !!input.type ? getTransactionTypeId(input.type) : undefined
    const toUpdateValues = { ...input, typeId, frequencyId }
    if (!frequencyId) {
      delete toUpdateValues.frequencyId
    }
    if (!typeId) {
      delete toUpdateValues.typeId
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

  async findManyByUser(userId: number): Promise<RecurrentTransaction[]> {
    const rows = await db
      .select()
      .from(recurrentTransactions)
      .leftJoin(categories, eq(categories.id, recurrentTransactions.categoryId))
      .where(eq(recurrentTransactions.userId, userId))
      .orderBy(desc(recurrentTransactions.nextDate))
    return RecurrentTransactionMapper.toDomains(rows)
  }
}
