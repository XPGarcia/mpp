import { useState } from "react"
import { TransactionType } from "../types"

export const useTransactionType = (defaultType?: TransactionType) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(defaultType ?? TransactionType.EXPENSE)

  return { transactionType, setTransactionType }
}
