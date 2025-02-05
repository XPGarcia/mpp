import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import {
  AccountsBalanceEntriesService,
  AccountsService,
  RecurrentTransactionRepository,
  Transaction,
  TransactionFrequency,
  TransactionRepository,
  TransactionType,
} from "@/modules/transactions/domain"
import { calculateNextTransactionDate } from "@/modules/transactions/utils"
import { BadRequestError } from "@/src/utils/errors/errors"
import { isIncome } from "@/utils"

export type CreateTransactionInput = {
  userId: number
  date: Date
  amount: number
  categoryId: number
  type: TransactionType
  description?: string
  isRecurrent: boolean
  frequency?: TransactionFrequency
}

export type CreateTransactionOutput = Promise<Transaction>

export interface CreateTransactionUseCase {
  execute(input: CreateTransactionInput): CreateTransactionOutput
}

@injectable()
export class CreateTransaction implements CreateTransactionUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository
  @inject(TYPES.RecurrentTransactionRepository)
  private readonly _recurrentTransactionRepository!: RecurrentTransactionRepository
  @inject(TYPES.AccountBalanceEntriesService)
  private readonly _accountBalanceEntriesService!: AccountsBalanceEntriesService
  @inject(TYPES.AccountsService) private readonly _accountsService!: AccountsService

  async execute(input: CreateTransactionInput) {
    const accountBalanceEntry = await this._accountBalanceEntriesService.getAccountBalanceEntryByDate({
      userId: input.userId,
      date: input.date,
    })

    let newRecurrentTransactionId: number | undefined
    if (input.isRecurrent) {
      if (!input.frequency) {
        console.error("Frequency is required for recurrent transactions", { input })
        throw new BadRequestError("Frequency is required for recurrent transactions")
      }
      const createdRecurrentTransaction = await this._recurrentTransactionRepository.createOne({
        ...input,
        accountId: accountBalanceEntry.accountId,
        startDate: input.date,
        nextDate: calculateNextTransactionDate(input.date, input.frequency),
        frequency: input.frequency,
      })
      if (!createdRecurrentTransaction) {
        console.error("Failed to create recurrent transaction", { input })
        throw new Error("Failed to create recurrent transaction")
      }
      newRecurrentTransactionId = createdRecurrentTransaction.id
    }

    const createdTransaction = await this._transactionRepository.createOne({
      ...input,
      accountId: accountBalanceEntry.accountId,
      recurrentTransactionId: newRecurrentTransactionId,
    })
    if (!createdTransaction) {
      throw new Error("Failed to create transaction")
    }

    const amount = isIncome(createdTransaction.type) ? createdTransaction.amount : createdTransaction.amount * -1
    await this._accountsService.updateBalance({ accountBalanceEntry, amount })

    return createdTransaction
  }
}
