import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { RecurrentTransactionRepository, TransactionRepository } from "@/modules/transactions/domain"
import { NotFoundError } from "@/src/utils/errors/errors"

export type DeleteRecurrentTransactionInput = {
  recurrentTransactionId: number
}

export type DeleteRecurrentTransactionOutput = void

export interface DeleteRecurrentTransactionUseCase {
  execute: (input: DeleteRecurrentTransactionInput) => Promise<DeleteRecurrentTransactionOutput>
}

@injectable()
export class DeleteRecurrentTransaction implements DeleteRecurrentTransactionUseCase {
  @inject(TYPES.RecurrentTransactionRepository)
  private readonly _recurrentTransactionRepo!: RecurrentTransactionRepository
  @inject(TYPES.TransactionRepository) private readonly _transactionRepo!: TransactionRepository

  async execute(input: DeleteRecurrentTransactionInput): Promise<DeleteRecurrentTransactionOutput> {
    const recurrentTransaction = await this._recurrentTransactionRepo.findOneById(input.recurrentTransactionId)
    if (!recurrentTransaction) {
      console.error("Recurrent transaction not found to delete", { input })
      throw new NotFoundError("Recurrent transaction not found to delete")
    }

    await this._transactionRepo.updateManyByRecurrentId(recurrentTransaction.id, { recurrentTransactionId: null })

    await this._recurrentTransactionRepo.deleteOneById(recurrentTransaction.id)
  }
}
