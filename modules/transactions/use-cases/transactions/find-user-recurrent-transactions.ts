import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { RecurrentTransaction, RecurrentTransactionRepository } from "@/modules/transactions/domain"

export type FindUserRecurrentTransactionsInput = {
  userId: number
}

export type FindUserRecurrentTransactionsOutput = Promise<RecurrentTransaction[]>

export interface FindUserRecurrentTransactionsUseCase {
  execute: (input: FindUserRecurrentTransactionsInput) => FindUserRecurrentTransactionsOutput
}

@injectable()
export class FindUserRecurrentTransactions implements FindUserRecurrentTransactionsUseCase {
  @inject(TYPES.RecurrentTransactionRepository)
  private readonly _recurrentTransactionRepo!: RecurrentTransactionRepository

  async execute(input: FindUserRecurrentTransactionsInput): FindUserRecurrentTransactionsOutput {
    return this._recurrentTransactionRepo.findManyByUser(input.userId)
  }
}
