import { db } from "@/db"
import { budgets } from "@/db/schema"
import { Budget } from "../types/budget"

type CreateBudgetInput = typeof budgets.$inferInsert

export class BudgetRepository {
  static async create(data: CreateBudgetInput): Promise<Budget | null> {
    const createdBudget = await db.insert(budgets).values(data).returning()
    return createdBudget.length > 0 ? createdBudget[0] : null
  }
}
