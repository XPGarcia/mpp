import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { RecurrentTransactionRepository } from "@/modules/transactions/domain"
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

  async execute(input: DeleteRecurrentTransactionInput): Promise<DeleteRecurrentTransactionOutput> {
    const recurrentTransaction = await this._recurrentTransactionRepo.findOneById(input.recurrentTransactionId)
    if (!recurrentTransaction) {
      console.error("Recurrent transaction not found to delete", { input })
      throw new NotFoundError("Recurrent transaction not found to delete")
    }

    await this._recurrentTransactionRepo.updateRecurrent(recurrentTransaction.id, { deletedAt: new Date() })
  }
}
