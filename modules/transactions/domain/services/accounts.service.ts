import { UpdateAccountBalanceInput, UpdateAccountBalanceOutput } from "@/modules/accounts/use-cases"

export interface AccountsService {
  updateBalance: (input: UpdateAccountBalanceInput) => UpdateAccountBalanceOutput
}
