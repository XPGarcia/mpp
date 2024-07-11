import { budgets } from "@/db/schema"
import { Budget } from "../types/budget"

type DrizzleBudget = typeof budgets.$inferSelect

export class BudgetMapper {
  static toDomain(dbCategory: DrizzleBudget): Budget {
    return {
      id: dbCategory.id,
      name: dbCategory.name,
      userId: dbCategory.userId,
      necessity: dbCategory.living,
      savings: dbCategory.savings,
      luxury: dbCategory.entertainment,
      createdAt: dbCategory.createdAt,
      updatedAt: dbCategory.updatedAt,
    }
  }
}
