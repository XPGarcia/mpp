const TYPES = {
  /*********** Accounts **********/
  // repositories
  AccountRepository: Symbol.for("AccountRepository"),
  AccountBalanceEntryRepository: Symbol.for("AccountBalanceEntryRepository"),
  // use-cases
  GetAccountBalanceEntryByDate: Symbol.for("GetAccountBalanceEntryByDate"),
  GetUserAccount: Symbol.for("GetUserAccount"),
  FindOneAccountBalanceEntryByAccountAndDate: Symbol.for("FindOneAccountBalanceEntryByAccountAndDate"),
  CreateOneAccountBalanceEntry: Symbol.for("CreateOneAccountBalanceEntry"),
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
