import { InternalServerError, NotFoundError } from "@/src/utils/errors/errors"

import {
  RecurrentTransaction,
  RecurrentTransactionRepository,
  Transaction,
  TransactionRepository,
} from "@/modules/transactions/domain"
import { inject, injectable } from "inversify"
import { TYPES } from "@/modules/container/types"
import { CreateTransaction } from "./create-transaction"
import { calculateNextTransactionDate } from "@/src/transactions/actions/calculate-next-transaction-date"

export type CreateTransactionFromRecurrentInput = RecurrentTransaction

export type CreateTransactionFromRecurrentOutput = Promise<Transaction>

export interface CreateTransactionFromRecurrentUseCase {
  execute(input: CreateTransactionFromRecurrentInput): CreateTransactionFromRecurrentOutput
}

@injectable()
export class CreateTransactionFromRecurrent implements CreateTransactionFromRecurrentUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository
  @inject(TYPES.CreateTransaction) private readonly _createTransaction!: CreateTransaction
  @inject(TYPES.RecurrentTransactionRepository)
  private readonly _recurrentTransactionRepo!: RecurrentTransactionRepository

  async execute(recurrentTransaction: CreateTransactionFromRecurrentInput): CreateTransactionFromRecurrentOutput {
    const oldTransaction = await this._transactionRepository.findOneById(recurrentTransaction.transactionId)
    if (!oldTransaction) {
      console.error("Transaction not found for recurrent", { recurrentTransaction })
      throw new NotFoundError("Transaction not found")
    }

    const newTransaction = await this._createTransaction.execute({
      amount: oldTransaction.amount,
      categoryId: oldTransaction.categoryId,
      type: oldTransaction.type,
      userId: oldTransaction.userId,
      description: oldTransaction.description,
      date: recurrentTransaction.nextDate,
      isRecurrent: true,
      frequency: recurrentTransaction.frequency,
    })
    const updatedRecurrentTransaction = await this._recurrentTransactionRepo.updateRecurrent(recurrentTransaction.id, {
      transactionId: newTransaction.id,
      nextDate: calculateNextTransactionDate(recurrentTransaction.nextDate, recurrentTransaction.frequency),
    })
    if (!updatedRecurrentTransaction) {
      console.error("Failed to update recurrent transaction", { recurrentTransaction })
      throw new InternalServerError("Failed to update recurrent transaction")
    }

    return newTransaction
  }
}
