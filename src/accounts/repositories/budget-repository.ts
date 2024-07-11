import { db } from "@/db"
import { budgets } from "@/db/schema"
import { Budget } from "../types/budget"
import { eq } from "drizzle-orm"
import { BudgetMapper } from "./budget-mapper"

type CreateBudgetInput = typeof budgets.$inferInsert

export class BudgetRepository {
  static async create(data: CreateBudgetInput): Promise<Budget | undefined> {
    const createdBudget = await db.insert(budgets).values(data).returning()
    return createdBudget.length > 0 ? BudgetMapper.toDomain(createdBudget[0]) : undefined
  }
  static async findOneByUserId(userId: number): Promise<Budget | undefined> {
    const budget = await db.query.budgets.findFirst({ where: eq(budgets.userId, userId) })
    return budget ? BudgetMapper.toDomain(budget) : undefined
  }
}
