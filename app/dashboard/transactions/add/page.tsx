"use client"

import { CreateTransactionForm, CreateTransactionFormData } from "@/src/transactions/components/create-transaction-form"
import { useToast } from "@/src/ui-lib/hooks/use-toast"
import { trpc } from "@/src/utils/_trpc/client"
import { AppRoutes } from "@/src/utils/routes"
import { useRouter } from "next/navigation"

export default function AddTransaction() {
  const router = useRouter()
  const { toast } = useToast()

  const { mutateAsync: createTransaction } = trpc.transactions.createOne.useMutation()

  const submit = async (data: CreateTransactionFormData) => {
    await createTransaction(data)
    toast({ description: "Transaction created successfully" })
  }

  const cancel = () => {
    router.push(AppRoutes.dashboard)
  }

  return (
    <main className='flex w-full justify-center'>
      <div className='flex w-full max-w-slim flex-col px-4 pt-8'>
        <CreateTransactionForm onSubmit={submit} onCancel={cancel} />
      </div>
    </main>
  )
}
