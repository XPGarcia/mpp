import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { Transaction, TransactionRepository } from "@/modules/transactions/domain"

export type FindTransactionInput = {
  transactionId: number
}

export type FindTransactionOutput = Promise<Transaction | undefined>

export interface FindTransactionUseCase {
  execute: (input: FindTransactionInput) => FindTransactionOutput
}

@injectable()
export class FindTransaction implements FindTransactionUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository

  async execute(input: FindTransactionInput): FindTransactionOutput {
    const transaction = await this._transactionRepository.findOneById(input.transactionId)
    if (!transaction) {
      return
    }
    return transaction
  }
}
