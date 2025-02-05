import { inject, injectable } from "inversify"

import { TYPES } from "@/modules/container/types"
import { AccountsBalanceEntriesService, AccountsService, TransactionRepository } from "@/modules/transactions/domain"
import { NotFoundError } from "@/src/utils/errors/errors"
import { isIncome } from "@/utils"

export type DeleteTransactionInput = {
  transactionId: number
}

export type DeleteTransactionOutput = void

export interface DeleteTransactionUseCase {
  execute: (input: DeleteTransactionInput) => Promise<DeleteTransactionOutput>
}

@injectable()
export class DeleteTransaction implements DeleteTransactionUseCase {
  @inject(TYPES.TransactionRepository) private readonly _transactionRepository!: TransactionRepository
  @inject(TYPES.AccountBalanceEntriesService)
  private readonly _accountBalanceEntryService!: AccountsBalanceEntriesService
  @inject(TYPES.AccountsService) private readonly _accountsService!: AccountsService

  async execute(input: DeleteTransactionInput): Promise<DeleteTransactionOutput> {
    const transaction = await this._transactionRepository.findOneById(input.transactionId)
    if (!transaction) {
      console.error("Transaction not found to delete", { input })
      throw new NotFoundError("Transaction not found to delete")
    }

    const accountBalanceEntry = await this._accountBalanceEntryService.getAccountBalanceEntryByDate({
      userId: transaction.userId,
      date: transaction.date,
    })

    await this._transactionRepository.deleteOne(transaction.id)

    const amount = isIncome(transaction.type) ? transaction.amount * -1 : transaction.amount
    await this._accountsService.updateBalance({ accountBalanceEntry, amount })
  }
}
