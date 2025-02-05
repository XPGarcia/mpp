import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { RecurrentTransaction, RecurrentTransactionRepository } from "@/modules/transactions/domain"

export type FindRecurrentTransactionInput = {
  recurrentTransactionId: number
  options?: {
    withTransactions?: boolean
  }
}

export type FindRecurrentTransactionOutput = Promise<RecurrentTransaction | undefined>

export interface FindRecurrentTransactionUseCase {
  execute: (input: FindRecurrentTransactionInput) => FindRecurrentTransactionOutput
}

@injectable()
export class FindRecurrentTransaction implements FindRecurrentTransactionUseCase {
  @inject(TYPES.RecurrentTransactionRepository)
  private readonly _recurrentTransactionRepo!: RecurrentTransactionRepository

  async execute(input: FindRecurrentTransactionInput): FindRecurrentTransactionOutput {
    const transaction = await this._recurrentTransactionRepo.findOneById(input.recurrentTransactionId, input.options)
    if (!transaction) {
      return
    }
    return transaction
  }
}
