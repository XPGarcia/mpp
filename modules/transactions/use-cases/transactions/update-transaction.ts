import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import {
  AccountsBalanceEntriesService,
  AccountsService,
  Transaction,
  TransactionRepository,
  TransactionType,
} from "@/modules/transactions/domain"
import { calculateAmountForBalance } from "@/modules/transactions/utils"

export type UpdateTransactionInput = {
  id: number
  date: Date
  amount?: number
  categoryId?: number
  type?: TransactionType
  description?: string
}

export type UpdateTransactionOutput = Promise<Transaction>

export interface UpdateTransactionUseCase {
  execute: (input: UpdateTransactionInput) => UpdateTransactionOutput
}

@injectable()
export class UpdateTransaction implements UpdateTransactionUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository
  @inject(TYPES.AccountBalanceEntriesService)
  private readonly _accountBalanceEntriesService!: AccountsBalanceEntriesService
  @inject(TYPES.AccountsService) private readonly _accountsService!: AccountsService

  async execute(input: UpdateTransactionInput): UpdateTransactionOutput {
    const { id, ...data } = input
    const oldTransaction = await this._transactionRepository.findOneById(id)
    if (!oldTransaction) {
      throw new Error("Transaction not found")
    }

    const accountBalanceEntry = await this._accountBalanceEntriesService.getAccountBalanceEntryByDate({
      userId: oldTransaction.userId,
      date: input.date,
    })

    const updatedTransaction = await this._transactionRepository.updateOne(oldTransaction.id, data)
    if (!updatedTransaction) {
      throw new Error("Failed to create transaction")
    }
    const amount = calculateAmountForBalance(oldTransaction, updatedTransaction)
    await this._accountsService.updateBalance({ accountBalanceEntry, amount })

    return updatedTransaction
  }
}
