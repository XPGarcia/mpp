"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { CreateTransactionForm, CreateTransactionFormData } from "@/src/transactions/components/create-transaction-form"
import { useToast } from "@/src/ui-lib/hooks/use-toast"
import { trpc } from "@/src/utils/_trpc/client"
import { AppRoutes } from "@/src/utils/routes"

interface Props {
  params: {
    id: string
  }
}

export default function UpdateTransaction({ params }: Props) {
  const router = useRouter()
  const { toast } = useToast()

  const {
    data: transaction,
    error,
    isLoading,
    isRefetching,
  } = trpc.transactions.findOneById.useQuery({ id: Number(params.id), withRecurrentTransaction: true }, { retry: 0 })
  if (error) {
    toast({ description: "Failed to load transaction" })
    router.push(AppRoutes.dashboard)
  }

  const { mutateAsync: updateTransaction } = trpc.transactions.updateOne.useMutation()

  const submit = async (data: CreateTransactionFormData) => {
    try {
      await updateTransaction({ id: Number(params.id), ...data })
      toast({ description: "Transaction updated successfully" })
      router.push(AppRoutes.dashboard)
    } catch (error) {
      toast({ description: "Failed to update transaction", variant: "destructive" })
    }
  }

  const cancel = () => {
    router.push(AppRoutes.dashboard)
  }

  return (
    <main className='flex w-full justify-center'>
      <div className='flex w-full max-w-slim flex-col px-4 pt-8'>
        {transaction && !isLoading && !isRefetching && (
          <CreateTransactionForm
            initialValues={{ ...transaction, description: transaction.description ?? "" }}
            withFrequency={transaction.isRecurrent}
            onSubmit={submit}
            onCancel={cancel}
          />
        )}
        {!transaction && isLoading && <Loader2 size={32} className='mx-auto animate-spin' />}
      </div>
    </main>
  )
}
