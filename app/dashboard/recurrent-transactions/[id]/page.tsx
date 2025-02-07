"use client"

import { Loader2, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Transaction } from "@/modules/transactions/domain"
import { useBoolean } from "@/src/misc/hooks/use-boolean"
import { DeleteRecurrentTransactionDialogDrawer } from "@/src/transactions/components/delete-recurrent-transaction-dialog-drawer"
import { RecurrentTransactionCard } from "@/src/transactions/components/recurrent-transaction-card"
import { RecurrentTransactionOverviewItem } from "@/src/transactions/components/recurrent-transaction-overview-item"
import { Button } from "@/src/ui-lib/components/ui/button"
import { useToast } from "@/src/ui-lib/hooks/use-toast"
import { trpc } from "@/src/utils/_trpc/client"
import { AppRoutes } from "@/src/utils/routes"

interface Props {
  params: {
    id: string
  }
}

export default function ViewRecurrentTransactionPage({ params }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const { value: isOpenDelete, on: openDelete, off: closeDelete } = useBoolean(false)

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

  if (!recurrentTransaction || isLoading || isRefetching) {
    return (
      <div className='mt-20 flex items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </div>
    )
  }

  const goToUpdatePage = () => {
    router.push(AppRoutes.updateRecurrentTransaction(recurrentTransaction.id))
  }

  const handleDelete = async () => {
    closeDelete()
    router.push(AppRoutes.recurrentTransactions)
  }

  const generateTransactionFromRecurrent = () => {
    const transaction: Transaction = {
      id: 0,
      amount: recurrentTransaction.amount,
      date: recurrentTransaction.nextDate,
      description: recurrentTransaction.description,
      type: recurrentTransaction.type,
      accountId: recurrentTransaction.accountId,
      categoryId: recurrentTransaction.categoryId,
      userId: recurrentTransaction.userId,
      createdAt: new Date(),
    }
    return transaction
  }

  return (
    <div>
      <header className='border-b'>
        <div className='flex items-center justify-between py-3'>
          <h1 className='text-xl font-semibold'>{recurrentTransaction.description}</h1>
          <div className='flex items-center gap-2'>
            <Button size='icon' variant='outline' onClick={goToUpdatePage}>
              <Pencil />
            </Button>
            <Button size='icon' variant='destructive' onClick={openDelete}>
              <Trash2 />
            </Button>
          </div>
        </div>
      </header>

      <main className='mt-8'>
        <div className='flex flex-col gap-y-8'>
          <RecurrentTransactionCard type='detailed' recurrentTransaction={recurrentTransaction} />

          <div>
            <h2 className='font-sm mb-4 text-xs uppercase tracking-wide text-muted-foreground'>
              Transactions Overview
            </h2>
            <div>
              <RecurrentTransactionOverviewItem transaction={generateTransactionFromRecurrent()} isPending={true} />
              {recurrentTransaction.transactions?.map((transaction) => (
                <RecurrentTransactionOverviewItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
        </div>
      </main>
      {isOpenDelete && (
        <DeleteRecurrentTransactionDialogDrawer
          recurrentTransaction={recurrentTransaction}
          isOpen={isOpenDelete}
          onClose={closeDelete}
          onSubmit={handleDelete}
        />
      )}
    </div>
  )
}
