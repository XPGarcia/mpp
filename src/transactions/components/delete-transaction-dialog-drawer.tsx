import { Transaction } from "@/modules/transactions/domain"
import { Button } from "@/src/ui-lib/components/ui/button"
import { Dialog, DialogClose,DialogContent, DialogHeader, DialogTitle } from "@/src/ui-lib/components/ui/dialog"
import { Drawer, DrawerClose,DrawerContent, DrawerHeader, DrawerTitle } from "@/src/ui-lib/components/ui/drawer"
import useMediaQuery from "@/src/ui-lib/hooks/use-media-query"

interface Props {
  transaction: Transaction
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onSubmit: () => void
}

export const DeleteTransactionDialogDrawer = ({ transaction, isOpen, isLoading, onClose, onSubmit }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const Body = () => {
    return (
      <>
        <p>
          Are you sure you want to delete this transaction{" "}
          {!!transaction.description && <b>{transaction.description}</b>}? This action {`can't`} be undone
        </p>
        <div className='mt-4 grid w-full grid-cols-2 gap-2'>
          <Button type='button' variant='ghost' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' isLoading={isLoading} onClick={onSubmit}>
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
            <DialogTitle>Delete Transaction</DialogTitle>
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
          <DrawerTitle>Delete Transaction</DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>
          <Body />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
