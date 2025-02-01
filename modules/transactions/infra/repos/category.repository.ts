import { injectable } from "inversify"
import {
  Category,
  CategoryRepository,
  CreateCategoryInput,
  FindUserCategoriesFilters,
  SpendingType,
  TransactionType,
  UpdateCategoryInput,
  WithSpend,
} from "@/modules/transactions/domain"
import { categories, transactions } from "@/db/schema"
import { db } from "@/db"
import { and, asc, eq, inArray, isNull, or, sql } from "drizzle-orm"
import { CategoryMapper } from "../mappers"
import { getSpendingTypeId, getTransactionTypeId } from "../utils"

@injectable()
export class DrizzleCategoryRepository implements CategoryRepository {
  async getUserCategoriesByTransaction({
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
    return CategoryMapper.toDomains(userCategories)
  }

  async createForUser(values: CreateCategoryInput): Promise<Category | undefined> {
    const transactionTypeId = getTransactionTypeId(values.transactionType)
    const spendingTypeId = getSpendingTypeId(values.spendingType)
    const createdCategories = await db
      .insert(categories)
      .values({ ...values, transactionTypeId, spendingTypeId })
      .returning()
    return createdCategories.length > 0 ? CategoryMapper.toDomain(createdCategories[0]) : undefined
  }

  async createManyForUser(values: CreateCategoryInput[]): Promise<Category[]> {
    const mappedValues = values.map((value) => ({
      ...value,
      transactionTypeId: getTransactionTypeId(value.transactionType),
      spendingTypeId: getSpendingTypeId(value.spendingType),
    }))
    const createdCategories = await db.insert(categories).values(mappedValues).returning()
    return CategoryMapper.toDomains(createdCategories)
  }

  async findOneById(categoryId: number): Promise<Category | undefined> {
    const category = await db.query.categories.findFirst({ where: eq(categories.id, categoryId) })
    return CategoryMapper.toDomain(category)
  }

  async updateOne(categoryId: number, values: UpdateCategoryInput): Promise<Category | undefined> {
    const toUpdateValues = {
      ...values,
      transactionTypeId: values.transactionType ? getTransactionTypeId(values.transactionType) : undefined,
      spendingTypeId: values.spendingType ? getSpendingTypeId(values.spendingType) : undefined,
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
    return CategoryMapper.toDomain(updatedCategories[0])
  }

  async deleteOne(categoryId: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, categoryId))
  }

  async findUserCategoriesWithSpend(params: {
    userId: number
    filters: FindUserCategoriesFilters
  }): Promise<WithSpend<Category>[]> {
    const { userId, filters } = params
    const { date, spendingTypes, transactionTypes } = filters

    const transactionJoinConditions = [eq(categories.id, transactions.categoryId)]
    if (date) {
      const dateFilters = [
        sql`EXTRACT(YEAR FROM ${transactions.date}) = ${date.year}`,
        sql`EXTRACT(MONTH FROM ${transactions.date}) = ${date.month}`,
      ]
      transactionJoinConditions.push(...dateFilters)
    }

    const conditions = [eq(categories.userId, userId)]
    if (spendingTypes && spendingTypes.length > 0) {
      const spendingTypeIds = spendingTypes.map(getSpendingTypeId)
      conditions.push(inArray(categories.spendingTypeId, spendingTypeIds))
    }

    if (transactionTypes && transactionTypes.length > 0) {
      const transactionTypeIds = transactionTypes.map(getTransactionTypeId)
      conditions.push(inArray(categories.transactionTypeId, transactionTypeIds))
    }

    const categoriesWithTotal = await db
      .select({
        id: categories.id,
        name: categories.name,
        userId: categories.userId,
        spendingTypeId: categories.spendingTypeId,
        transactionTypeId: categories.transactionTypeId,
        totalSpend: sql`COALESCE(SUM(${transactions.amount}), 0)`.mapWith(Number),
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .leftJoin(transactions, and(...transactionJoinConditions))
      .where(and(...conditions))
      .groupBy(sql`${categories.id}`)

    return CategoryMapper.toDomainsWithSpend(categoriesWithTotal)
  }
}
