export const ApiRoutes = {
  register: "/api/register",
  userCategoriesByTransaction: (userId: number, transactionTypeId: number) =>
    `/api/categories?userId=${userId}&transactionTypeId=${transactionTypeId}`,
  createTransaction: "/api/transactions",
  getTransactions: (userId: number) => `/api/transactions?userId=${userId}`,
  createCategoryForUser: "/api/categories/createForUser",
}

export const AppRoutes = {
  addTransaction: "/transactions/add",
}
