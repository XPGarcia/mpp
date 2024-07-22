import { db } from "@/db"
import { RecurrentTransaction, Transaction, TransactionFrequency, TransactionType } from "../types"
import { categories, recurrentTransactions, transactionTypes, transactions } from "@/db/schema"
import { and, count, desc, eq, gte, lt, sql } from "drizzle-orm"
import { TransactionMapper } from "./transaction-mapper"
import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"
import { getTransactionFrequencyId } from "@/src/utils/mappers/transaction-frequency-mappers"
import { calculateNextTransactionDate } from "../actions/calculate-next-transaction-date"
import { RecurrentTransactionMapper } from "./recurrent-transaction-mapper"
import dayjs from "dayjs"

type CreateTransactionInput = Omit<typeof transactions.$inferInsert, "typeId"> & {
  type: TransactionType
  isRecurrent: boolean
  frequency?: TransactionFrequency
}

type UpdateTransactionInput = Partial<CreateTransactionInput>

type CreateRecurrentTransactionInput = Omit<typeof recurrentTransactions.$inferInsert, "frequencyId"> & {
  frequency: TransactionFrequency
}

type UpdateRecurrentTransactionInput = Partial<CreateRecurrentTransactionInput>

export class TransactionRepository {
  static async createOne(input: CreateTransactionInput): Promise<Transaction> {
    const typeId = getTransactionTypeId(input.type)
    const rows = await db
      .insert(transactions)
      .values({ ...input, typeId })
      .returning()
    const createdTransaction = TransactionMapper.toDomain(rows[0])
    if (!createdTransaction) {
      throw new Error("Failed to create transaction")
    }
    if (!input.isRecurrent) {
      return createdTransaction
    }
    if (!input.frequency) {
      console.error("Frequency is required for recurrent transactions", { input })
      throw new Error("Frequency is required for recurrent transactions")
    }
    const frequencyId = getTransactionFrequencyId(input.frequency)
    const nextDate = calculateNextTransactionDate(createdTransaction.date, input.frequency)
    const cratedRows = await db
      .insert(recurrentTransactions)
      .values({ transactionId: createdTransaction.id, frequencyId, startDate: createdTransaction.date, nextDate })
      .returning()
    if (cratedRows.length === 0) {
      console.error("Failed to create recurrent transaction", { input })
      throw new Error("Failed to create recurrent transaction")
    }
    return createdTransaction
  }

  static async findOneById(transactionId: number): Promise<Transaction | undefined> {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, transactionId),
    })
    return TransactionMapper.toDomain(transaction)
  }

  static async findAllByUserId(userId: number): Promise<Transaction[]> {
    const rows = await db
      .select()
      .from(transactions)
      .leftJoin(categories, eq(categories.id, transactions.categoryId))
      .leftJoin(transactionTypes, eq(transactionTypes.id, transactions.typeId))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
    return TransactionMapper.toDomains(rows)
  }

  static async findAllByCategoryId(categoryId: number): Promise<Transaction[]> {
    const rows = await db.select().from(transactions).where(eq(transactions.categoryId, categoryId))
    return TransactionMapper.toDomains(rows)
  }

  static async findManyByUserIdAndMonthRange(
    userId: number,
    options: { month: string; year: string }
  ): Promise<Transaction[]> {
    const rows = await db
      .select()
      .from(transactions)
      .leftJoin(categories, eq(categories.id, transactions.categoryId))
      .leftJoin(transactionTypes, eq(transactionTypes.id, transactions.typeId))
      .where(
        and(
          eq(transactions.userId, userId),
          sql`EXTRACT(YEAR FROM ${transactions.date}) = ${options.year}`,
          sql`EXTRACT(MONTH FROM ${transactions.date}) = ${options.month}`
        )
      )
      .orderBy(desc(transactions.date))
    return TransactionMapper.toDomains(rows)
  }

  static async updateOne(transactionId: number, input: UpdateTransactionInput): Promise<Transaction | undefined> {
    const typeId = !!input.type ? getTransactionTypeId(input.type) : undefined
    const toUpdateValues = { ...input, typeId }
    if (!typeId) {
      delete toUpdateValues.typeId
    }

    const updatedTransaction = await db
      .update(transactions)
      .set(toUpdateValues)
      .where(eq(transactions.id, transactionId))
      .returning()
    return TransactionMapper.toDomain(updatedTransaction[0])
  }

  static async deleteOne(transactionId: number): Promise<void> {
    const recurrentTransaction = await this.findRecurrentByParentId(transactionId)
    if (!!recurrentTransaction) {
      await this.deleteRecurrentByParentId(transactionId)
    }
    await db.delete(transactions).where(eq(transactions.id, transactionId))
  }

  static async countByCategoryId(categoryId: number): Promise<number> {
    const rows = await db
      .select({ count: count(transactions.id) })
      .from(transactions)
      .where(eq(transactions.categoryId, categoryId))
    return rows[0]?.count ?? 0
  }

  static async updateManyByCategoryId(categoryId: number, input: UpdateTransactionInput): Promise<void> {
    const typeId = !!input.type ? getTransactionTypeId(input.type) : undefined
    const toUpdateValues = { ...input, typeId }
    if (!typeId) {
      delete toUpdateValues.typeId
    }

    await db.update(transactions).set(toUpdateValues).where(eq(transactions.categoryId, categoryId))
  }

  static async findRecurrentByParentId(parentId: number): Promise<RecurrentTransaction | undefined> {
    const recurrentTransaction = await db.query.recurrentTransactions.findFirst({
      where: eq(recurrentTransactions.transactionId, parentId),
    })
    if (!recurrentTransaction) {
      return
    }
    return RecurrentTransactionMapper.toDomain(recurrentTransaction)
  }

  static async deleteRecurrentByParentId(parentId: number): Promise<void> {
    await db.delete(recurrentTransactions).where(eq(recurrentTransactions.transactionId, parentId))
  }

  static async updateRecurrent(
    id: number,
    input: UpdateRecurrentTransactionInput
  ): Promise<RecurrentTransaction | undefined> {
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

  static async findAllRecurrentForToday(): Promise<RecurrentTransaction[]> {
    const today = dayjs().startOf("day").toDate()
    const tomorrow = dayjs().add(1, "day").startOf("day").toDate()
    const rows = await db
      .select()
      .from(recurrentTransactions)
      .where(and(gte(recurrentTransactions.nextDate, today), lt(recurrentTransactions.nextDate, tomorrow)))
    return RecurrentTransactionMapper.toDomains(rows)
  }
}
