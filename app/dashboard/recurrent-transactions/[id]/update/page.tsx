"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { CreateTransactionForm, CreateTransactionFormData } from "@/src/transactions/components/create-transaction-form"
import { useToast } from "@/src/ui-lib/hooks/use-toast"
import { trpc } from "@/src/utils/_trpc/client"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { AppRoutes } from "@/src/utils/routes"

interface Props {
  params: {
    id: string
  }
}

export default function UpdateRecurrentTransactionPage({ params }: Props) {
  const router = useRouter()
  const { toast } = useToast()

  const {
    data: recurrentTransaction,
    error,
    isLoading,
    isRefetching,
  } = trpc.transactions.findOneRecurrentById.useQuery({ id: Number(params.id) }, { retry: 0 })
  if (error) {
    toast({ description: "Failed to load transaction", variant: "destructive" })
    router.push(AppRoutes.recurrentTransactions)
  }

  const { mutateAsync: updateRecurrentTransaction } = trpc.transactions.updateRecurrentTransaction.useMutation()

  const submit = async (data: CreateTransactionFormData) => {
    try {
      const frequency = data.frequency
      if (!frequency) {
        throw new Error("Frequency is required")
      }
      await updateRecurrentTransaction({ id: Number(params.id), ...data, frequency })
      toast({ description: "Recurrent transaction updated successfully" })
      router.push(AppRoutes.viewRecurrentTransaction(Number(params.id)))
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast({ description: errorMessage, variant: "destructive" })
    }
  }

  const cancel = () => {
    router.push(AppRoutes.dashboard)
  }

  if (!recurrentTransaction || isLoading || isRefetching) {
    return (
      <div className='mt-20 flex items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </div>
    )
  }

  return (
    <main className='flex w-full justify-center'>
      <div className='flex w-full max-w-slim flex-col px-4 pt-8'>
        <CreateTransactionForm
          initialValues={{
            ...recurrentTransaction,
            date: recurrentTransaction.startDate,
            description: recurrentTransaction.description ?? "",
            isRecurrent: true,
          }}
          onSubmit={submit}
          onCancel={cancel}
        />
      </div>
    </main>
  )
}
