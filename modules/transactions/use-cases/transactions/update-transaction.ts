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
import { calculateAmountForBalance } from "@/modules/transactions/utils"
import { inject, injectable } from "inversify"
import { UpdateRecurrentTransaction } from "./update-recurrent-transaction"

export type UpdateTransactionInput = {
  id: number
  date: Date
  amount?: number
  categoryId?: number
  type?: TransactionType
  description?: string
  isRecurrent?: boolean
  frequency?: TransactionFrequency
}

export type UpdateTransactionOutput = Promise<Transaction>

export interface UpdateTransactionUseCase {
  execute: (input: UpdateTransactionInput) => UpdateTransactionOutput
}

@injectable()
export class UpdateTransaction implements UpdateTransactionUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository
  @inject(TYPES.RecurrentTransactionRepository)
  private readonly _recurrentTransactionRepository!: RecurrentTransactionRepository
  @inject(TYPES.AccountBalanceEntriesService)
  private readonly _accountBalanceEntriesService!: AccountsBalanceEntriesService
  @inject(TYPES.AccountsService) private readonly _accountsService!: AccountsService
  @inject(TYPES.UpdateRecurrentTransaction) private readonly _updateRecurrentTransaction!: UpdateRecurrentTransaction

  async execute(input: UpdateTransactionInput): UpdateTransactionOutput {
    const { id, frequency, isRecurrent, ...data } = input
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

    if (isRecurrent === undefined) {
      return updatedTransaction
    }

    const oldRecurrentTransaction = await this._recurrentTransactionRepository.findRecurrentByParentId(
      oldTransaction.id
    )
    if (!!oldRecurrentTransaction) {
      oldTransaction.isRecurrent = true
      oldTransaction.frequency = oldRecurrentTransaction.frequency
    }

    const updatedRecurrentTransaction = await this._updateRecurrentTransaction.execute({
      oldTransaction,
      updatedTransaction,
      newIsRecurrent: isRecurrent,
      newFrequency: frequency,
    })
    if (!!updatedRecurrentTransaction) {
      updatedTransaction.isRecurrent = true
      updatedTransaction.frequency = updatedRecurrentTransaction.frequency
    }

    return updatedTransaction
  }
}
