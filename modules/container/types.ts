const TYPES = {
  /*********** Accounts **********/
  // repositories
  AccountRepository: Symbol.for("AccountRepository"),
  AccountBalanceEntryRepository: Symbol.for("AccountBalanceEntryRepository"),
  BudgetRepository: Symbol.for("BudgetRepository"),
  // use-cases
  GetAccountBalanceEntryByDate: Symbol.for("GetAccountBalanceEntryByDate"),
  GetUserAccount: Symbol.for("GetUserAccount"),
  FindOneAccountBalanceEntryByAccountAndDate: Symbol.for("FindOneAccountBalanceEntryByAccountAndDate"),
  CreateOneAccountBalanceEntry: Symbol.for("CreateOneAccountBalanceEntry"),
  CreateOneAccount: Symbol.for("CreateOneAccount"),
  CreateOneBudget: Symbol.for("CreateOneBudget"),
  FindOneBudgetByUserId: Symbol.for("FindOneBudgetByUserId"),
  /*********** Accounts **********/

  /*********** Transactions **********/
  // repositories
  TransactionRepository: Symbol.for("TransactionRepository"),
  RecurrentTransactionRepository: Symbol.for("RecurrentTransactionRepository"),
  // use-cases
  GetMonthlyExpensesDistributionForUser: Symbol.for("GetMonthlyExpensesDistributionForUser"),
  UpdateAmountAccountBalanceEntry: Symbol.for("UpdateAmountAccountBalanceEntry"),
  /*********** Transactions **********/
}

export { TYPES }
