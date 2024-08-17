import { Budget } from "../entities"

export interface BudgetRepository {
  createOne(data: CreateBudgetInput): Promise<Budget | undefined>
  findOneByUserId(userId: number): Promise<Budget | undefined>
}

export type CreateBudgetInput = {
  name: string
  userId: number
  living: number
  savings: number
  entertainment: number
  id?: number | undefined
  createdAt?: Date | undefined
  updatedAt?: Date | undefined
}
