import { eq } from "drizzle-orm"
import { injectable } from "inversify"

import { db } from "@/db"
import { budgets } from "@/db/schema"
import { Budget, BudgetRepository, CreateBudgetInput } from "@/modules/accounts/domain"

import { BudgetMapper } from "../mappers"

@injectable()
export class DrizzleBudgetRepository implements BudgetRepository {
  async createOne(data: CreateBudgetInput): Promise<Budget | undefined> {
    const createdBudget = await db.insert(budgets).values(data).returning()
    return createdBudget.length > 0 ? BudgetMapper.toDomain(createdBudget[0]) : undefined
  }
  async findOneByUserId(userId: number): Promise<Budget | undefined> {
    const budget = await db.query.budgets.findFirst({ where: eq(budgets.userId, userId) })
    return budget ? BudgetMapper.toDomain(budget) : undefined
  }
}
