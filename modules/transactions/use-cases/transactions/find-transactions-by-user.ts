import { TYPES } from "@/modules/container/types"
import { Transaction, TransactionRepository } from "@/modules/transactions/domain"
import { inject, injectable } from "inversify"

export type FindTransactionsByUserInput = {
  userId: number
}

export type FindTransactionsByUserOutput = Promise<Transaction[]>

export interface FindTransactionsByUserUseCase {
  execute: (input: FindTransactionsByUserInput) => FindTransactionsByUserOutput
}

@injectable()
export class FindTransactionsByUser implements FindTransactionsByUserUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository

  async execute(input: FindTransactionsByUserInput): FindTransactionsByUserOutput {
    return this._transactionRepository.findAllByUserId(input.userId)
  }
}
