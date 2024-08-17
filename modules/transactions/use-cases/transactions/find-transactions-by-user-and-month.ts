import { TYPES } from "@/modules/container/types"
import { Transaction, TransactionRepository } from "@/modules/transactions/domain"
import { inject, injectable } from "inversify"

export type FindTransactionsByUserAndMonthInput = {
  userId: number
  date: { month: string; year: string }
}

export type FindTransactionsByUserAndMonthOutput = Promise<Transaction[]>

export interface FindTransactionsByUserAndMonthUseCase {
  execute: (input: FindTransactionsByUserAndMonthInput) => FindTransactionsByUserAndMonthOutput
}

@injectable()
export class FindTransactionsByUserAndMonth implements FindTransactionsByUserAndMonthUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository

  async execute(input: FindTransactionsByUserAndMonthInput): FindTransactionsByUserAndMonthOutput {
    return this._transactionRepository.findManyByUserIdAndMonthRange(input.userId, input.date)
  }
}
