export const ApiRoutes = {
  register: "/api/register",
  userCategoriesByTransaction: (userId: number, transactionTypeId: number) =>
    `/api/categories?userId=${userId}&transactionTypeId=${transactionTypeId}`,
  createTransaction: "/api/transactions",
  getTransactions: (userId: number) => `/api/transactions?userId=${userId}`,
}

export const AppRoutes = {
  addTransaction: "/transactions/add",
}
