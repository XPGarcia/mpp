import { Container } from "inversify"
import { TYPES } from "./types"
import { AccountRepository } from "@/modules/accounts/domain"
import { DrizzleAccountBalanceEntryRepository, DrizzleAccountRepository } from "@/modules/accounts/infra"
import { GetAccountBalanceEntryByDate } from "@/modules/accounts/use-cases"
import { RecurrentTransactionRepository, TransactionRepository } from "@/modules/transactions/domain"
import { DrizzleRecurrentTransactionRepository, DrizzleTransactionRepository } from "@/modules/transactions/infra"
import { GetMonthlyExpensesDistributionForUser } from "@/modules/transactions/use-cases"

const myContainer = new Container()

/*********** Accounts **********/
// repositories
myContainer.bind<AccountRepository>(TYPES.AccountRepository).to(DrizzleAccountRepository)
myContainer.bind(TYPES.AccountBalanceEntryRepository).to(DrizzleAccountBalanceEntryRepository)
// use-cases
myContainer.bind(TYPES.GetAccountBalanceEntryByDate).to(GetAccountBalanceEntryByDate)
/*********** Accounts **********/

/*********** Transactions **********/
// repositories
myContainer.bind<TransactionRepository>(TYPES.TransactionRepository).to(DrizzleTransactionRepository)
myContainer
  .bind<RecurrentTransactionRepository>(TYPES.RecurrentTransactionRepository)
  .to(DrizzleRecurrentTransactionRepository)
// use-cases
myContainer.bind(TYPES.GetMonthlyExpensesDistributionForUser).to(GetMonthlyExpensesDistributionForUser)

export { myContainer }
