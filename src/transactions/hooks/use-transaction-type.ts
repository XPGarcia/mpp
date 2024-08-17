import { TransactionType } from "@/modules/transactions/types"
import { useState } from "react"

export const useTransactionType = (defaultType?: TransactionType) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(defaultType ?? TransactionType.EXPENSE)

  return { transactionType, setTransactionType }
}
