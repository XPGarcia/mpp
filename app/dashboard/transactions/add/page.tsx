"use client"

import { CreateTransactionForm, CreateTransactionFormData } from "@/src/transactions/components/create-transaction-form"
import { trpc } from "@/src/utils/_trpc/client"
import { AppRoutes } from "@/src/utils/routes"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function AddTransaction() {
  const router = useRouter()

  const { mutateAsync: createTransaction } = trpc.transactions.createOne.useMutation()

  const submit = async (data: CreateTransactionFormData) => {
    await createTransaction(data)
    toast.success("Transaction created successfully")
  }

  const cancel = () => {
    router.push(AppRoutes.dashboard)
  }

  return (
    <main className='flex w-full justify-center'>
      <div className='flex w-full max-w-slim flex-col px-4 py-8'>
        <CreateTransactionForm onSubmit={submit} onCancel={cancel} />
      </div>
    </main>
  )
}
