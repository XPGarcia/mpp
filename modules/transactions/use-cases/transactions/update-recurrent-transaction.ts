import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import {
  RecurrentTransaction,
  RecurrentTransactionRepository,
  TransactionFrequency,
  TransactionType,
} from "@/modules/transactions/domain"
import { calculateNextTransactionDate } from "@/modules/transactions/utils"

export type UpdateRecurrentTransactionInput = {
  id: number
  date: Date
  amount: number
  categoryId: number
  type: TransactionType
  description?: string
  frequency: TransactionFrequency
  totalOccurrences?: number
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
    const { id, date, totalOccurrences, ...rest } = input
    const recurrentTransaction = await this._recurrentTransactionRepo.findOneById(input.id)
    if (!recurrentTransaction) {
      console.error("Recurrent transaction not found", { input })
      throw new Error("Recurrent transaction not found")
    }
    if (
      totalOccurrences != null &&
      recurrentTransaction.currentOccurrence != null &&
      totalOccurrences < recurrentTransaction.currentOccurrence
    ) {
      throw new Error(
        `Total occurrences (${totalOccurrences}) cannot be less than current occurrence (${recurrentTransaction.currentOccurrence})`
      )
    }
    const updatedRecurrentTransaction = await this._recurrentTransactionRepo.updateRecurrent(recurrentTransaction.id, {
      ...rest,
      startDate: date,
      nextDate: calculateNextTransactionDate(date, rest.frequency),
      totalOccurrences,
    })
    if (!updatedRecurrentTransaction) {
      console.error("Failed to update recurrent transaction", { input })
      throw new Error("Failed to update recurrent transaction")
    }
    return updatedRecurrentTransaction
  }
}
