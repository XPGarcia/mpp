import { TYPES } from "@/modules/container/types"
import { inject, injectable } from "inversify"
import { AccountBalanceEntry, AccountBalanceEntryRepository } from "@/modules/accounts/domain"

export type FindOneAccountBalanceEntryByAccountAndDateInput = {
  accountId: number
  date: Date
}

export type FindOneAccountBalanceEntryByAccountAndDateOutput = Promise<AccountBalanceEntry | undefined>

export interface FindOneAccountBalanceEntryByAccountAndDateUseCase {
  execute(input: FindOneAccountBalanceEntryByAccountAndDateInput): FindOneAccountBalanceEntryByAccountAndDateOutput
}

@injectable()
export class FindOneAccountBalanceEntryByAccountAndDate implements FindOneAccountBalanceEntryByAccountAndDateUseCase {
  @inject(TYPES.AccountBalanceEntryRepository)
  private readonly _accountBalanceEntryRepository!: AccountBalanceEntryRepository

  async execute(
    input: FindOneAccountBalanceEntryByAccountAndDateInput
  ): FindOneAccountBalanceEntryByAccountAndDateOutput {
    const { accountId, date } = input
    return await this._accountBalanceEntryRepository.findOneByAccountAndDate(accountId, date)
  }
}
