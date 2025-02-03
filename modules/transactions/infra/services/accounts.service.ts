import { injectable } from "inversify"

import { accountsClient } from "@/modules/accounts"
import { UpdateAccountBalanceInput, UpdateAccountBalanceOutput } from "@/modules/accounts/use-cases"
import { AccountsService } from "@/modules/transactions/domain"

@injectable()
export class ImplAccountsService implements AccountsService {
  async updateBalance(input: UpdateAccountBalanceInput): UpdateAccountBalanceOutput {
    return await accountsClient.updateBalance(input)
  }
}
