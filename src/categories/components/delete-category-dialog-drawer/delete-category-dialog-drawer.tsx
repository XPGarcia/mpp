import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/src/ui-lib/components/ui/dialog"
import useMediaQuery from "@/src/ui-lib/hooks/use-media-query"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/src/ui-lib/components/ui/drawer"
import { Button } from "@/src/ui-lib/components/ui/button"

interface InnerProps {
  onClose: () => void
  onAccept: () => void
}

const InnerComponent = ({ onClose, onAccept }: InnerProps) => {
  return (
    <div className='flex w-full flex-col items-center justify-end gap-3'>
      <p className='w-full'>Are you sure you want to delete this category?</p>
      <div className='flex w-full items-center justify-center gap-4'>
        <Button variant='ghost' onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onAccept}>Delete</Button>
      </div>
    </div>
  )
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export const DeleteCategoryDialogDrawer = ({ isOpen, onClose, onAccept }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='p-4 sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete category</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <InnerComponent onClose={onClose} onAccept={onAccept} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerClose />
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Delete category</DrawerTitle>
        </DrawerHeader>
        <div className='p-4 pt-2'>
          <InnerComponent onClose={onClose} onAccept={onAccept} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
