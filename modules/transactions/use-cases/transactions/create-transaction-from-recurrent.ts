import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { RecurrentTransaction, RecurrentTransactionRepository, Transaction } from "@/modules/transactions/domain"

import { calculateNextTransactionDate } from "../../utils"
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
    const newTransaction = await this._createTransaction.execute({
      amount: recurrentTransaction.amount,
      categoryId: recurrentTransaction.categoryId,
      type: recurrentTransaction.type,
      userId: recurrentTransaction.userId,
      description: recurrentTransaction.description,
      date: recurrentTransaction.nextDate,
      isRecurrent: false,
    })

    await this._recurrentTransactionRepo.updateRecurrent(recurrentTransaction.id, {
      startDate: newTransaction.date,
      nextDate: calculateNextTransactionDate(newTransaction.date, recurrentTransaction.frequency),
    })

    return newTransaction
  }
}
