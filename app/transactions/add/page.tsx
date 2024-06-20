"use client"

import { BottomDrawer } from "@/src/misc/components/bottom-drawer/bottom-drawer"
import { CreateTransactionForm, CreateTransactionFormData } from "@/src/transactions/components/create-transaction-form"
import { useCreateTransaction } from "@/src/transactions/hooks/use-create-transaction"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export default function AddTransaction() {
  const router = useRouter()

  const { createTransaction } = useCreateTransaction()

  const submit = async (data: CreateTransactionFormData) => {
    await createTransaction(data)
    toast.success("Transaction created successfully")
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
