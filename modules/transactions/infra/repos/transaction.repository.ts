import { injectable } from "inversify"
import {
  CreateTransactionInput,
  Transaction,
  TransactionRepository,
  UpdateTransactionInput,
} from "@/modules/transactions/domain"
import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"
import { db } from "@/db"
import { categories, transactionTypes, transactions } from "@/db/schema"
import { TransactionMapper } from "../mappers"
import { and, desc, eq, sql, count } from "drizzle-orm"

@injectable()
export class DrizzleTransactionRepository implements TransactionRepository {
  async createOne(input: CreateTransactionInput): Promise<Transaction | undefined> {
    const typeId = getTransactionTypeId(input.type)
    const rows = await db
      .insert(transactions)
      .values({ ...input, typeId })
      .returning()
    return TransactionMapper.toDomain(rows[0])
    // if (!input.isRecurrent) {
    //   return createdTransaction
    // }
    // if (!input.frequency) {
    //   console.error("Frequency is required for recurrent transactions", { input })
    //   throw new Error("Frequency is required for recurrent transactions")
    // }
    // const frequencyId = getTransactionFrequencyId(input.frequency)
    // const nextDate = calculateNextTransactionDate(createdTransaction.date, input.frequency)
    // const cratedRows = await db
    //   .insert(recurrentTransactions)
    //   .values({ transactionId: createdTransaction.id, frequencyId, startDate: createdTransaction.date, nextDate })
    //   .returning()
    // if (cratedRows.length === 0) {
    //   console.error("Failed to create recurrent transaction", { input })
    //   throw new Error("Failed to create recurrent transaction")
    // }
    // return createdTransaction
  }

  async findOneById(transactionId: number): Promise<Transaction | undefined> {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, transactionId),
    })
    return TransactionMapper.toDomain(transaction)
  }

  async findAllByUserId(userId: number): Promise<Transaction[]> {
    const rows = await db
      .select()
      .from(transactions)
      .leftJoin(categories, eq(categories.id, transactions.categoryId))
      .leftJoin(transactionTypes, eq(transactionTypes.id, transactions.typeId))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
    return TransactionMapper.toDomains(rows)
  }

  async findAllByCategoryId(categoryId: number): Promise<Transaction[]> {
    const rows = await db.select().from(transactions).where(eq(transactions.categoryId, categoryId))
    return TransactionMapper.toDomains(rows)
  }

  async findManyByUserIdAndMonthRange(
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

  async updateOne(transactionId: number, input: UpdateTransactionInput): Promise<Transaction | undefined> {
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

  async deleteOne(transactionId: number): Promise<void> {
    // const recurrentTransaction = await this.findRecurrentByParentId(transactionId)
    // if (!!recurrentTransaction) {
    //   await this.deleteRecurrentByParentId(transactionId)
    // }
    await db.delete(transactions).where(eq(transactions.id, transactionId))
  }

  async countByCategoryId(categoryId: number): Promise<number> {
    const rows = await db
      .select({ count: count(transactions.id) })
      .from(transactions)
      .where(eq(transactions.categoryId, categoryId))
    return rows[0]?.count ?? 0
  }

  async updateManyByCategoryId(categoryId: number, input: UpdateTransactionInput): Promise<void> {
    const typeId = !!input.type ? getTransactionTypeId(input.type) : undefined
    const toUpdateValues = { ...input, typeId }
    if (!typeId) {
      delete toUpdateValues.typeId
    }

    await db.update(transactions).set(toUpdateValues).where(eq(transactions.categoryId, categoryId))
  }
}
