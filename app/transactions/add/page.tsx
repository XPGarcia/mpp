"use client"

import { Button } from "@/src/misc"
import { CreateTransactionForm, CreateTransactionFormData } from "@/src/transactions/components/create-transaction-form"
import { useCreateTransaction } from "@/src/transactions/hooks/use-create-transaction"
import { TransactionType } from "@/src/transactions/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export default function AddTransaction() {
  const router = useRouter()
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.INCOME)

  const { createTransaction } = useCreateTransaction()

  const submit = async (data: CreateTransactionFormData) => {
    await createTransaction(data)
    toast.success("Transaction created successfully")
    router.push("/")
  }

  const cancel = () => {
    router.push("/")
  }

  return (
    <main className='flex w-full justify-center'>
      <div className='flex w-full max-w-slim flex-col px-4 py-8'>
        <CreateTransactionForm onSubmit={submit} onCancel={cancel} />
      </div>
    </main>
  )
}
