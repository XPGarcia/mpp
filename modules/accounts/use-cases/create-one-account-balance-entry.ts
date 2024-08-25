import { TYPES } from "@/modules/container/types"
import { inject, injectable } from "inversify"
import { AccountBalanceEntry, AccountBalanceEntryRepository } from "@/modules/accounts/domain"

export type CreateOneAccountBalanceEntryInput = {
  accountId: number
  amount: number
  description: string
}

export type CreateOneAccountBalanceEntryOutput = Promise<AccountBalanceEntry | undefined>

export interface CreateOneAccountBalanceEntryUseCase {
  execute(input: CreateOneAccountBalanceEntryInput): CreateOneAccountBalanceEntryOutput
}

@injectable()
export class CreateOneAccountBalanceEntry implements CreateOneAccountBalanceEntryUseCase {
  @inject(TYPES.AccountBalanceEntryRepository)
  private readonly _accountBalanceEntryRepository!: AccountBalanceEntryRepository

  async execute(input: CreateOneAccountBalanceEntryInput): CreateOneAccountBalanceEntryOutput {
    return await this._accountBalanceEntryRepository.createOne(input)
  }
}
