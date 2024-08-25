import { injectable } from "inversify"
import {
  RecurrentTransaction,
  RecurrentTransactionRepository,
  TransactionFrequency,
  UpdateRecurrentTransactionInput,
} from "@/modules/transactions/domain"
import { recurrentTransactions } from "@/db/schema"
import { db } from "@/db"
import { and, eq, gte, lt } from "drizzle-orm"
import { getTransactionFrequencyId } from "@/src/utils/mappers/transaction-frequency-mappers"
import dayjs from "dayjs"
import { RecurrentTransactionMapper } from "../mappers"

@injectable()
export class DrizzleRecurrentTransactionRepository implements RecurrentTransactionRepository {
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

  async findAllDailyRecurrentForToday(): Promise<RecurrentTransaction[]> {
    const today = dayjs().startOf("day").toDate()
    const tomorrow = dayjs().add(1, "day").startOf("day").toDate()
    return this.findManyRecurrentByRangeAndFrequency({ fromDate: today, toDate: tomorrow, frequency: "DAILY" })
  }

  async findAllWeeklyRecurrentForThisWeek(): Promise<RecurrentTransaction[]> {
    const startOfWeek = dayjs().startOf("week").toDate()
    const endOfWeek = dayjs().endOf("week").toDate()
    return this.findManyRecurrentByRangeAndFrequency({
      fromDate: startOfWeek,
      toDate: endOfWeek,
      frequency: "WEEKLY",
    })
  }

  async findAllMonthlyRecurrentForThisWeek(): Promise<RecurrentTransaction[]> {
    const startOfMonth = dayjs().startOf("month").toDate()
    const endOfMonth = dayjs().endOf("month").toDate()
    return this.findManyRecurrentByRangeAndFrequency({
      fromDate: startOfMonth,
      toDate: endOfMonth,
      frequency: "MONTHLY",
    })
  }
}
