export interface Account {
  id: number
  userId: number
  name: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

export interface AccountBalanceEntry {
  id: number
  accountId: number
  amount: number
}
