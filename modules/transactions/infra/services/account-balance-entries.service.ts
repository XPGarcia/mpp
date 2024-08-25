import { injectable } from "inversify"
import { AccountsBalanceEntriesService } from "@/modules/transactions/domain"
import {
  FindOneAccountBalanceEntryByAccountAndDateInput,
  FindOneAccountBalanceEntryByAccountAndDateOutput,
} from "@/modules/accounts/use-cases"
import { accountBalanceEntriesClient } from "@/modules/accounts"

@injectable()
export class ImplAccountBalanceEntriesService implements AccountsBalanceEntriesService {
  async findOneByAccountAndDate(
    input: FindOneAccountBalanceEntryByAccountAndDateInput
  ): FindOneAccountBalanceEntryByAccountAndDateOutput {
    return await accountBalanceEntriesClient.findOneByAccountAndDate(input)
  }
}
