import { TYPES } from "@/modules/container/types"
import { inject, injectable } from "inversify"
import { Budget, BudgetRepository } from "@/modules/accounts/domain"

export type CreateOneBudgetInput = {
  userId: number
  name: string
  living: number
  savings: number
  entertainment: number
}

export type CreateOneBudgetOutput = Promise<Budget | undefined>

export interface CreateOneBudgetUseCase {
  execute(input: CreateOneBudgetInput): CreateOneBudgetOutput
}

@injectable()
export class CreateOneBudget implements CreateOneBudgetUseCase {
  @inject(TYPES.BudgetRepository)
  private readonly _budgetRepository!: BudgetRepository

  async execute(input: CreateOneBudgetInput): CreateOneBudgetOutput {
    return await this._budgetRepository.createOne(input)
  }
}
