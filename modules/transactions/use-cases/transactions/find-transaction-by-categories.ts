import { TYPES } from "@/modules/container/types"
import { FindUserTransactionsFilters, Transaction, TransactionRepository } from "@/modules/transactions/domain"
import { inject, injectable } from "inversify"

export type FindUserTransactionsInput = {
  userId: number
  filters: FindUserTransactionsFilters
}

export type FindUserTransactionsOutput = Promise<Transaction[]>

export interface FindUserTransactionsUseCase {
  execute: (input: FindUserTransactionsInput) => FindUserTransactionsOutput
}

@injectable()
export class FindUserTransactions implements FindUserTransactionsUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository

  async execute(input: FindUserTransactionsInput): FindUserTransactionsOutput {
    return this._transactionRepository.findManyByUserAndFilters(input.userId, input.filters)
  }
}
