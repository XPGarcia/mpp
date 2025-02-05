"use client"

import { RecurrentTransaction } from "@/modules/transactions/domain"
import { Button } from "@/src/ui-lib/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/src/ui-lib/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/src/ui-lib/components/ui/drawer"
import useMediaQuery from "@/src/ui-lib/hooks/use-media-query"
import { useToast } from "@/src/ui-lib/hooks/use-toast"
import { trpc } from "@/src/utils/_trpc/client"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"

interface Props {
  recurrentTransaction: RecurrentTransaction
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export const DeleteRecurrentTransactionDialogDrawer = ({ recurrentTransaction, isOpen, onClose, onSubmit }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { toast } = useToast()

  const { mutateAsync: deleteRecurrentTransaction, isPending: isPendingDelete } =
    trpc.transactions.deleteRecurrentTransaction.useMutation()

  const handleDelete = async () => {
    try {
      await deleteRecurrentTransaction({ recurrentTransactionId: recurrentTransaction.id })
      toast({ description: "Recurrent transaction deleted successfully" })
      onSubmit()
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to delete transaction")
      toast({ description: errorMessage, variant: "destructive" })
    }
  }

  const Body = () => {
    return (
      <>
        <p>
          Are you sure you want to delete this recurrent transaction{" "}
          {!!recurrentTransaction.description && <b>{recurrentTransaction.description}</b>}? This action {`can't`} be
          undone
        </p>
        <div className='mt-4 grid w-full grid-cols-2 gap-2'>
          <Button type='button' variant='ghost' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' isLoading={isPendingDelete} onClick={handleDelete}>
            Accept
          </Button>
        </div>
      </>
    )
  }

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete Recurrent Transaction</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <Body />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerClose />
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Delete Recurrent Transaction</DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>
          <Body />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
