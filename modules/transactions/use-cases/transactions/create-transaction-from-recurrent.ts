import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import {
  RecurrentTransaction,
  RecurrentTransactionRepository,
  Transaction,
  UpdateRecurrentTransactionInput,
} from "@/modules/transactions/domain"
import { BadRequestError } from "@/src/utils/errors/errors"

import { calculateNextTransactionDate, formatRecurrentDescription } from "../../utils"
import { CreateTransaction } from "./create-transaction"

export type CreateTransactionFromRecurrentInput = RecurrentTransaction

export type CreateTransactionFromRecurrentOutput = Promise<Transaction>

export interface CreateTransactionFromRecurrentUseCase {
  execute(input: CreateTransactionFromRecurrentInput): CreateTransactionFromRecurrentOutput
}

@injectable()
export class CreateTransactionFromRecurrent implements CreateTransactionFromRecurrentUseCase {
  @inject(TYPES.CreateTransaction) private readonly _createTransaction!: CreateTransaction
  @inject(TYPES.RecurrentTransactionRepository)
  private readonly _recurrentTransactionRepo!: RecurrentTransactionRepository

  async execute(recurrentTransaction: CreateTransactionFromRecurrentInput): CreateTransactionFromRecurrentOutput {
    if (recurrentTransaction.finishedAt) {
      throw new BadRequestError("Recurrent transaction has already finished")
    }

    if (
      recurrentTransaction.totalOccurrences != null &&
      recurrentTransaction.currentOccurrence != null &&
      recurrentTransaction.currentOccurrence >= recurrentTransaction.totalOccurrences
    ) {
      throw new BadRequestError("Recurrent transaction has reached the maximum number of occurrences")
    }

    const isFinite = recurrentTransaction.totalOccurrences != null
    const nextOccurrence = isFinite ? (recurrentTransaction.currentOccurrence ?? 0) + 1 : undefined

    const description = isFinite
      ? formatRecurrentDescription(recurrentTransaction.description, nextOccurrence!, recurrentTransaction.totalOccurrences!)
      : recurrentTransaction.description

    const newTransaction = await this._createTransaction.execute({
      amount: recurrentTransaction.amount,
      categoryId: recurrentTransaction.categoryId,
      type: recurrentTransaction.type,
      userId: recurrentTransaction.userId,
      description,
      date: recurrentTransaction.nextDate,
      isRecurrent: false,
    })

    const updateData: UpdateRecurrentTransactionInput = {
      startDate: newTransaction.date,
      nextDate: calculateNextTransactionDate(newTransaction.date, recurrentTransaction.frequency),
    }

    if (isFinite) {
      updateData.currentOccurrence = nextOccurrence
      if (nextOccurrence! >= recurrentTransaction.totalOccurrences!) {
        updateData.finishedAt = new Date()
      }
    }

    await this._recurrentTransactionRepo.updateRecurrent(recurrentTransaction.id, updateData)

    return newTransaction
  }
}
