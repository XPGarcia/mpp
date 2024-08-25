import { injectable } from "inversify"
import { AccountsService } from "@/modules/transactions/domain"
import { UpdateAccountBalanceInput, UpdateAccountBalanceOutput } from "@/modules/accounts/use-cases"
import { accountsClient } from "@/modules/accounts"

@injectable()
export class ImplAccountsService implements AccountsService {
  async updateBalance(input: UpdateAccountBalanceInput): UpdateAccountBalanceOutput {
    return await accountsClient.updateBalance(input)
  }
}
