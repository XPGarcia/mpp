import { inject, injectable } from "inversify"

import { Account, AccountRepository } from "@/modules/accounts/domain"
import { TYPES } from "@/modules/container/types"

export type CreateOneAccountInput = {
  userId: number
  name: string
  balance: number
  currency: string
}

export type CreateOneAccountOutput = Promise<Account | undefined>

export interface CreateOneAccountUseCase {
  execute(input: CreateOneAccountInput): CreateOneAccountOutput
}

@injectable()
export class CreateOneAccount implements CreateOneAccountUseCase {
  @inject(TYPES.AccountRepository)
  private readonly _accountRepository!: AccountRepository

  async execute(input: CreateOneAccountInput): CreateOneAccountOutput {
    return await this._accountRepository.create(input)
  }
}
