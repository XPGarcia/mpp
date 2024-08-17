import { Account, AccountRepository } from "@/modules/accounts/domain"
import { TYPES } from "@/modules/container/types"
import { inject, injectable } from "inversify"

export type GetUserAccountInput = {
  userId: number
}

export type GetUserAccountOutput = Promise<Account | undefined>

export interface GetUserAccountUseCase {
  execute(input: GetUserAccountInput): GetUserAccountOutput
}

@injectable()
export class GetUserAccount implements GetUserAccountUseCase {
  @inject(TYPES.AccountRepository) private readonly _accountRepository!: AccountRepository

  async execute(input: GetUserAccountInput): GetUserAccountOutput {
    return await this._accountRepository.findByUserId(input.userId)
  }
}
