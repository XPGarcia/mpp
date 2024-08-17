import { inject, injectable } from "inversify"
import {
  AccountsBalanceEntriesService,
  AccountsService,
  RecurrentTransactionRepository,
  Transaction,
  TransactionFrequency,
  TransactionRepository,
  TransactionType,
} from "@/modules/transactions/domain"
import { TYPES } from "@/modules/container/types"
import { BadRequestError } from "@/src/utils/errors/errors"
import { calculateNextTransactionDate } from "@/modules/transactions/utils"
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

    const createdTransaction = await this._transactionRepository.createOne({
      ...input,
      accountId: accountBalanceEntry.accountId,
    })
    if (!createdTransaction) {
      throw new Error("Failed to create transaction")
    }

    if (input.isRecurrent) {
      if (!input.frequency) {
        console.error("Frequency is required for recurrent transactions", { input })
        throw new BadRequestError("Frequency is required for recurrent transactions")
      }
      const createdRecurrentTransaction = await this._recurrentTransactionRepository.createOne({
        transactionId: createdTransaction.id,
        startDate: createdTransaction.date,
        nextDate: calculateNextTransactionDate(createdTransaction.date, input.frequency),
        frequency: input.frequency,
      })
      if (!createdRecurrentTransaction) {
        console.error("Failed to create recurrent transaction", { input })
        throw new Error("Failed to create recurrent transaction")
      }
    }

    const amount = isIncome(createdTransaction.type) ? createdTransaction.amount : createdTransaction.amount * -1
    await this._accountsService.updateBalance({ accountBalanceEntry, amount })

    return createdTransaction
  }
}
