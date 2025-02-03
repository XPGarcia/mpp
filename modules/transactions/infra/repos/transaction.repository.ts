import { and, count, desc, eq, inArray,sql } from "drizzle-orm"
import { injectable } from "inversify"

import { db } from "@/db"
import { categories, transactions,transactionTypes } from "@/db/schema"
import {
  CreateTransactionInput,
  FindUserTransactionsFilters,
  Transaction,
  TransactionRepository,
  UpdateTransactionInput,
} from "@/modules/transactions/domain"

import { TransactionMapper } from "../mappers"
import { getTransactionTypeId } from "../utils"

@injectable()
export class DrizzleTransactionRepository implements TransactionRepository {
  async createOne(input: CreateTransactionInput): Promise<Transaction | undefined> {
    const typeId = getTransactionTypeId(input.type)
    const rows = await db
      .insert(transactions)
      .values({ ...input, typeId })
      .returning()
    return TransactionMapper.toDomain(rows[0])
  }

  async findOneById(transactionId: number): Promise<Transaction | undefined> {
    const transaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, transactionId),
    })
    return TransactionMapper.toDomain(transaction)
  }

  async findAllByCategoryId(categoryId: number): Promise<Transaction[]> {
    const rows = await db.select().from(transactions).where(eq(transactions.categoryId, categoryId))
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

  async findManyByUserAndFilters(userId: number, filters: FindUserTransactionsFilters): Promise<Transaction[]> {
    const { date, categoriesIds } = filters
    const conditions = [eq(transactions.userId, userId)]

    if (date) {
      conditions.push(
        sql`EXTRACT(YEAR FROM ${transactions.date}) = ${date.year}`,
        sql`EXTRACT(MONTH FROM ${transactions.date}) = ${date.month}`
      )
    }

    if (categoriesIds && categoriesIds.length > 0) {
      conditions.push(inArray(transactions.categoryId, categoriesIds))
    }

    const rows = await db
      .select()
      .from(transactions)
      .leftJoin(categories, eq(categories.id, transactions.categoryId))
      .leftJoin(transactionTypes, eq(transactionTypes.id, transactions.typeId))
      .where(and(...conditions))
      .orderBy(desc(transactions.date))
    return TransactionMapper.toDomains(rows)
  }
}
