"use client"

import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { useRouter } from "next/navigation"
import { AppRoutes } from "@/src/utils/routes"
import { useBoolean } from "@/src/misc/hooks/use-boolean"
import { trpc } from "@/src/utils/_trpc/client"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { Transaction } from "@/modules/transactions/types"
import { isIncome } from "@/utils"
import { DeleteTransactionDialogDrawer } from "./delete-transaction-dialog-drawer"
import { Button } from "@/src/ui-lib/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/src/ui-lib/hooks/use-toast"

interface Props {
  transaction: Transaction
  onDelete: () => void
}

export const TransactionRow = ({ transaction, onDelete }: Props) => {
  const router = useRouter()
  const { toast } = useToast()
  const { value: actionsOpen, toggle: toggleActions, off: closeActions } = useBoolean(false)
  const { value: isOpenDelete, on: openDelete, off: closeDelete } = useBoolean(false)

  const { mutateAsync: deleteTransaction, isPending: isPendingDelete } = trpc.transactions.deleteOne.useMutation()

  const onUpdateClicked = () => {
    closeActions()
    router.push(AppRoutes.updateTransaction(transaction.id))
  }

  const handleDelete = async () => {
    try {
      await deleteTransaction({ transactionId: transaction.id })
      toast({ description: "Transaction deleted successfully" })
      closeDelete()
      closeActions()
      onDelete()
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to delete transaction")
      toast({ description: errorMessage, variant: "destructive" })
    }
  }

  return (
    <>
      <div key={transaction.id} className='flex'>
        <div className='flex w-full justify-between' onClick={toggleActions}>
          <div>
            <p className='text-sm font-medium'>{transaction.category?.name ?? ""}</p>
            <p className='text-sm font-light text-shades-50'>
              {transaction.description === "" ? "\u00A0" : transaction.description}
            </p>
          </div>
          <p className={`text-sm font-medium ${isIncome(transaction.type) ? "text-blue-500" : "text-red-500"}`}>
            {formatNumberToMoney(transaction.amount)}
          </p>
        </div>
        {actionsOpen && (
          <div className='ml-2 flex'>
            <Button
              size='sm'
              style={{ padding: "0 8px", borderRadius: "8px 0 0 8px" }}
              className='h-full'
              onClick={onUpdateClicked}
            >
              <Pencil size={16} />
            </Button>
            <Button
              size='sm'
              variant='destructive'
              style={{ padding: "0 8px", borderRadius: "0 8px 8px 0" }}
              className='h-full'
              onClick={openDelete}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
      {isOpenDelete && (
        <DeleteTransactionDialogDrawer
          transaction={transaction}
          isOpen={isOpenDelete}
          isLoading={isPendingDelete}
          onClose={closeDelete}
          onSubmit={handleDelete}
        />
      )}
    </>
  )
}
