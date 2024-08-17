"use client"

import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { Button } from "@/src/misc"
import { Icon } from "@/src/misc/components/icons/icon"
import { useRouter } from "next/navigation"
import { AppRoutes } from "@/src/utils/routes"
import { useBoolean } from "@/src/misc/hooks/use-boolean"
import { BottomDrawer } from "@/src/misc/components/bottom-drawer/bottom-drawer"
import { trpc } from "@/src/utils/_trpc/client"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { Transaction } from "@/modules/transactions/types"
import { isIncome } from "@/utils"

interface Props {
  transaction: Transaction
  onDelete: () => void
}

export const TransactionRow = ({ transaction, onDelete }: Props) => {
  const router = useRouter()
  const { value: actionsOpen, toggle: toggleActions, off: closeActions } = useBoolean(false)
  const { value: isOpenDelete, on: openDelete, off: closeDelete } = useBoolean(false)

  const { mutateAsync: deleteTransaction, isPending } = trpc.transactions.deleteOne.useMutation()

  const onUpdateClicked = () => {
    closeActions()
    router.push(AppRoutes.updateTransaction(transaction.id))
  }

  const handleDelete = async () => {
    try {
      await deleteTransaction({ transactionId: transaction.id })
      toast.success("Transaction deleted successfully")
      closeDelete()
      closeActions()
      onDelete()
    } catch (error) {
      console.error(error)
      const errorMessage = getErrorMessage(error, "Failed to delete transaction")
      toast.error(errorMessage)
    }
  }

  return (
    <>
      <div key={transaction.id} className='flex'>
        <div className='flex w-full justify-between' onClick={toggleActions}>
          <div>
            <p className='text-sm font-medium'>{transaction.category?.name ?? ""}</p>
            {transaction.description && <p className='text-sm font-light text-shades-50'>{transaction.description}</p>}
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
              <Icon icon='pencil' size='sm' />
            </Button>
            <Button
              size='sm'
              scheme='error'
              style={{ padding: "0 8px", borderRadius: "0 8px 8px 0" }}
              className='h-full'
              onClick={openDelete}
            >
              <Icon icon='trash' size='sm' />
            </Button>
          </div>
        )}
      </div>
      {isOpenDelete && (
        <BottomDrawer isOpen={isOpenDelete} onClose={closeDelete} title='Delete transaction?'>
          <p>
            Are you sure you want to delete this transaction{" "}
            {!!transaction.description && <b>{transaction.description}</b>}? This action {`can't`} be undone
          </p>
          <div className='mt-4 grid w-full grid-cols-2 gap-2'>
            <Button type='button' variant='ghost' onClick={closeDelete}>
              Cancel
            </Button>
            <Button type='submit' isLoading={isPending} onClick={handleDelete}>
              Accept
            </Button>
          </div>
        </BottomDrawer>
      )}
    </>
  )
}
