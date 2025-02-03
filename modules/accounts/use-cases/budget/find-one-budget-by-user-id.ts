import { inject, injectable } from "inversify"

import { Budget, BudgetRepository } from "@/modules/accounts/domain"
import { TYPES } from "@/modules/container/types"

export type FindOneBudgetByUserIdInput = {
  userId: number
}

export type FindOneBudgetByUserIdOutput = Promise<Budget | undefined>

export interface FindOneBudgetByUserIdUseCase {
  execute(input: FindOneBudgetByUserIdInput): FindOneBudgetByUserIdOutput
}

@injectable()
export class FindOneBudgetByUserId implements FindOneBudgetByUserIdUseCase {
  @inject(TYPES.BudgetRepository)
  private readonly _budgetRepository!: BudgetRepository

  async execute(input: FindOneBudgetByUserIdInput): FindOneBudgetByUserIdOutput {
    return await this._budgetRepository.findOneByUserId(input.userId)
  }
}
