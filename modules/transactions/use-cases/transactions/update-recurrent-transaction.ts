import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import {
  RecurrentTransaction,
  RecurrentTransactionRepository,
  Transaction,
  TransactionFrequency,
} from "@/modules/transactions/domain"
import { calculateNextTransactionDate } from "@/modules/transactions/utils"

export type UpdateRecurrentTransactionInput = {
  oldTransaction: Transaction
  updatedTransaction: Transaction
  newIsRecurrent: boolean
  newFrequency?: TransactionFrequency
}

export type UpdateRecurrentTransactionOutput = Promise<RecurrentTransaction | undefined>

export interface UpdateRecurrentTransactionUseCase {
  execute: (input: UpdateRecurrentTransactionInput) => UpdateRecurrentTransactionOutput
}

@injectable()
export class UpdateRecurrentTransaction implements UpdateRecurrentTransactionUseCase {
  @inject(TYPES.RecurrentTransactionRepository)
  private readonly _recurrentTransactionRepo!: RecurrentTransactionRepository

  async execute(input: UpdateRecurrentTransactionInput): UpdateRecurrentTransactionOutput {
    const { oldTransaction, updatedTransaction, newIsRecurrent, newFrequency } = input
    if (!newIsRecurrent) {
      await this._recurrentTransactionRepo.deleteRecurrentByParentId(oldTransaction.id)
      return
    }
    if (!newFrequency) {
      console.error("Frequency is required to update recurrent transactions", { input })
      throw new Error("Frequency is required to update recurrent transactions")
    }
    const recurrentTransaction = await this._recurrentTransactionRepo.findRecurrentByParentId(oldTransaction.id)
    if (!recurrentTransaction) {
      console.error("Recurrent transaction not found", { input })
      throw new Error("Recurrent transaction not found")
    }
    const updatedRecurrentTransaction = await this._recurrentTransactionRepo.updateRecurrent(recurrentTransaction.id, {
      frequency: newFrequency,
      startDate: updatedTransaction.date,
      nextDate: calculateNextTransactionDate(updatedTransaction.date, newFrequency),
    })
    if (!updatedRecurrentTransaction) {
      console.error("Failed to update recurrent transaction", { input })
      throw new Error("Failed to update recurrent transaction")
    }
    return updatedRecurrentTransaction
  }
}
