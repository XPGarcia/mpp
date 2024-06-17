"use client"

import { Button } from "@/src/misc"
import { CreateTransactionForm } from "@/src/transactions/components/create-transaction-form"
import { useCreateTransaction } from "@/src/transactions/hooks/use-create-transaction"
import { TransactionType } from "@/src/transactions/types"
import { useState } from "react"

export default function AddTransaction() {
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.INCOME)

  const { createTransaction } = useCreateTransaction()

  return (
    <main className='flex w-full justify-center'>
      <div className='flex w-full max-w-slim flex-col px-4 py-8'>
        <div className='flex w-full justify-center gap-3'>
          <Button
            size='sm'
            variant={transactionType === TransactionType.INCOME ? "solid" : "outline"}
            onClick={() => {
              setTransactionType(TransactionType.INCOME)
            }}
          >
            Income
          </Button>
          <Button
            size='sm'
            variant={transactionType === TransactionType.EXPENSE ? "solid" : "outline"}
            onClick={() => {
              setTransactionType(TransactionType.EXPENSE)
            }}
          >
            Expense
          </Button>
        </div>
        <div className='mt-4'>
          <CreateTransactionForm transactionType={transactionType} onSubmit={createTransaction} />
        </div>
      </div>
    </main>
  )
}
