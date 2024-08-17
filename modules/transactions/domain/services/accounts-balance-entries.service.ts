import {
  FindOneAccountBalanceEntryByAccountAndDateInput,
  FindOneAccountBalanceEntryByAccountAndDateOutput,
  GetAccountBalanceEntryByDateInput,
  GetAccountBalanceEntryByDateOutput,
} from "@/modules/accounts/use-cases"

export interface AccountsBalanceEntriesService {
  findOneByAccountAndDate(
    input: FindOneAccountBalanceEntryByAccountAndDateInput
  ): FindOneAccountBalanceEntryByAccountAndDateOutput
  getAccountBalanceEntryByDate(input: GetAccountBalanceEntryByDateInput): GetAccountBalanceEntryByDateOutput
}
