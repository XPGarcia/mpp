const TYPES = {
  /*********** Accounts **********/
  // repositories
  AccountRepository: Symbol.for("AccountRepository"),
  AccountBalanceEntryRepository: Symbol.for("AccountBalanceEntryRepository"),
  // use-cases
  GetAccountBalanceEntryByDate: Symbol.for("GetAccountBalanceEntryByDateUseCase"),
  /*********** Accounts **********/

  /*********** Transactions **********/
  // repositories
  TransactionRepository: Symbol.for("TransactionRepository"),
  RecurrentTransactionRepository: Symbol.for("RecurrentTransactionRepository"),
  // use-cases
  GetMonthlyExpensesDistributionForUser: Symbol.for("GetMonthlyExpensesDistributionForUserUseCase"),
  /*********** Transactions **********/
}

export { TYPES }
