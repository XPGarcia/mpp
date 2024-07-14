import { db } from "@/db"
import { Category } from "../types"
import { categories, transactions } from "@/db/schema"
import { and, asc, eq, isNull, or, sql } from "drizzle-orm"
import { SpendingType, TransactionType } from "@/src/transactions/types"
import { getTransactionTypeFromId, getTransactionTypeId } from "@/src/utils/get-transaction-type-id"
import { CategoryMapper } from "./category-mapper"
import { getSpendingTypeFromId, getSPendingTypeId } from "@/src/utils/get-spending-type-id"

type CreateCategoryInput = Omit<typeof categories.$inferInsert, "transactionTypeId" | "spendingTypeId"> & {
  transactionType: TransactionType
  spendingType: SpendingType
}

type UpdateCategoryInput = Omit<Partial<CreateCategoryInput>, "userId" | "id">

export class CategoryRepository {
  static async getUserCategoriesByTransaction({
    userId,
    transactionType,
  }: {
    userId: number
    transactionType: TransactionType
  }): Promise<Category[]> {
    const transactionTypeId = getTransactionTypeId(transactionType)
    const userCategories = await db
      .select()
      .from(categories)
      .where(
        and(
          or(eq(categories.userId, userId), isNull(categories.userId)),
          eq(categories.transactionTypeId, transactionTypeId)
        )
      )
      .orderBy(asc(categories.name))
    return userCategories.map(CategoryMapper.toDomain)
  }

  static async createForUser(values: CreateCategoryInput): Promise<Category | undefined> {
    const transactionTypeId = getTransactionTypeId(values.transactionType)
    const spendingTypeId = getSPendingTypeId(values.spendingType)
    const createdCategories = await db
      .insert(categories)
      .values({ ...values, transactionTypeId, spendingTypeId })
      .returning()
    return createdCategories.length > 0 ? CategoryMapper.toDomain(createdCategories[0]) : undefined
  }

  static async createManyForUser(values: CreateCategoryInput[]): Promise<Category[]> {
    const mappedValues = values.map((value) => ({
      ...value,
      transactionTypeId: getTransactionTypeId(value.transactionType),
      spendingTypeId: getSPendingTypeId(value.spendingType),
    }))
    const createdCategories = await db.insert(categories).values(mappedValues).returning()
    return createdCategories.map(CategoryMapper.toDomain)
  }

  static async findOneById(categoryId: number): Promise<Category | undefined> {
    const category = await db.query.categories.findFirst({ where: eq(categories.id, categoryId) })
    return category ? CategoryMapper.toDomain(category) : undefined
  }

  static async updateOne(categoryId: number, values: UpdateCategoryInput): Promise<Category | undefined> {
    const toUpdateValues = {
      ...values,
      transactionTypeId: values.transactionType ? getTransactionTypeId(values.transactionType) : undefined,
      spendingTypeId: values.spendingType ? getSPendingTypeId(values.spendingType) : undefined,
    }
    if (!toUpdateValues.transactionType) {
      delete toUpdateValues.transactionTypeId
    }
    if (!toUpdateValues.spendingType) {
      delete toUpdateValues.spendingTypeId
    }
    const updatedCategories = await db
      .update(categories)
      .set(toUpdateValues)
      .where(eq(categories.id, categoryId))
      .returning()
    return updatedCategories.length > 0 ? CategoryMapper.toDomain(updatedCategories[0]) : undefined
  }

  static async deleteOne(categoryId: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, categoryId))
  }

  static async getUserCategoriesBySpendingTypeWithTotalSpend({
    userId,
    spendingType,
    date,
  }: {
    userId: number
    spendingType: SpendingType
    date?: { month: string; year: string }
  }) {
    const spendingTypeId = getSPendingTypeId(spendingType)
    const filters = [eq(categories.userId, userId), eq(categories.spendingTypeId, spendingTypeId)]
    if (!!date) {
      const dateFilters = [
        sql`EXTRACT(YEAR FROM ${transactions.date}) = ${date.year}`,
        sql`EXTRACT(MONTH FROM ${transactions.date}) = ${date.month}`,
      ]
      filters.push(...dateFilters)
    }

    return await db
      .select({
        id: categories.id,
        name: categories.name,
        spendingTypeId: categories.spendingTypeId,
        totalSpend: sql`sum(${transactions.amount})`.mapWith(Number),
      })
      .from(categories)
      .leftJoin(transactions, eq(categories.id, transactions.categoryId))
      .where(and(...filters))
      .groupBy(sql`${categories.id}`)
  }
}
