"use client"

import { CreateTransactionForm, CreateTransactionFormData } from "@/src/transactions/components/create-transaction-form"
import { trpc } from "@/src/utils/_trpc/client"
import { AppRoutes } from "@/src/utils/routes"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface Props {
  params: {
    id: string
  }
}

export default function UpdateTransaction({ params }: Props) {
  const router = useRouter()

  const {
    data: transaction,
    error,
    isLoading,
    isRefetching,
  } = trpc.transactions.findOneById.useQuery({ id: Number(params.id) }, { retry: 0 })
  if (error) {
    console.error(error)
    toast.error("Failed to load transaction")
    router.push(AppRoutes.dashboard)
  }

  const { mutateAsync: updateTransaction } = trpc.transactions.updateOne.useMutation()

  const submit = async (data: CreateTransactionFormData) => {
    try {
      await updateTransaction({ id: Number(params.id), ...data })
      toast.success("Transaction updated successfully")
      router.push(AppRoutes.dashboard)
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const cancel = () => {
    router.push(AppRoutes.dashboard)
  }

  return (
    <main className='flex w-full justify-center'>
      <div className='flex w-full max-w-slim flex-col px-4 py-8'>
        {transaction && !isLoading && !isRefetching && (
          <CreateTransactionForm
            initialValues={{ ...transaction, description: transaction.description ?? "" }}
            onSubmit={submit}
            onCancel={cancel}
          />
        )}
        {!transaction && isLoading && <p>Loading...</p>}
      </div>
    </main>
  )
}
