import { injectable } from "inversify"
import { AccountsBalanceEntriesService } from "@/modules/transactions/domain"
import {
  FindOneAccountBalanceEntryByAccountAndDateInput,
  FindOneAccountBalanceEntryByAccountAndDateOutput,
  GetAccountBalanceEntryByDateInput,
  GetAccountBalanceEntryByDateOutput,
} from "@/modules/accounts/use-cases"
import { accountBalanceEntriesClient } from "@/modules/accounts"

@injectable()
export class ImplAccountBalanceEntriesService implements AccountsBalanceEntriesService {
  async findOneByAccountAndDate(
    input: FindOneAccountBalanceEntryByAccountAndDateInput
  ): FindOneAccountBalanceEntryByAccountAndDateOutput {
    return await accountBalanceEntriesClient.findOneByAccountAndDate(input)
  }
  async getAccountBalanceEntryByDate(input: GetAccountBalanceEntryByDateInput): GetAccountBalanceEntryByDateOutput {
    return await accountBalanceEntriesClient.getAccountBalanceEntryByDate(input)
  }
}
