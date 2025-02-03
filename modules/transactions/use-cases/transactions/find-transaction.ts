import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { RecurrentTransactionRepository, Transaction, TransactionRepository } from "@/modules/transactions/domain"

export type FindTransactionInput = {
  transactionId: number
  withRecurrentTransaction: boolean
}

export type FindTransactionOutput = Promise<Transaction | undefined>

export interface FindTransactionUseCase {
  execute: (input: FindTransactionInput) => FindTransactionOutput
}

@injectable()
export class FindTransaction implements FindTransactionUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository
  @inject(TYPES.RecurrentTransactionRepository)
  private readonly _recurrentTransactionRepo!: RecurrentTransactionRepository

  async execute(input: FindTransactionInput): FindTransactionOutput {
    const transaction = await this._transactionRepository.findOneById(input.transactionId)
    if (!transaction) {
      return
    }
    if (input.withRecurrentTransaction) {
      const recurrentTransaction = await this._recurrentTransactionRepo.findRecurrentByParentId(transaction.id)
      if (!!recurrentTransaction) {
        transaction.isRecurrent = true
        transaction.frequency = recurrentTransaction.frequency
      }
    }
    return transaction
  }
}
