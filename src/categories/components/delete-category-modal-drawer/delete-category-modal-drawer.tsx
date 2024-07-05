import { BottomDrawer } from "@/src/misc/components/bottom-drawer/bottom-drawer"
import { Modal } from "@/src/misc/components/modal/modal"
import { Button } from "@/src/misc"

interface Props {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export const DeleteCategoryModalDrawer = ({ isOpen, onClose, onAccept }: Props) => {
  return (
    <>
      <div className='block md:hidden'>
        <BottomDrawer isOpen={isOpen} onClose={onClose}>
          <div className='flex w-full flex-col items-center justify-end gap-3'>
            <p>Are you sure you want to delete this category?</p>
            <div className='flex w-full items-center justify-center gap-4'>
              <Button variant='ghost' onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onAccept}>Delete</Button>
            </div>
          </div>
        </BottomDrawer>
      </div>
      <div className='hidden md:block'>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <p>Are you sure you want to delete this category?</p>
          <Button onClick={onAccept}>Yes</Button>
        </Modal>
      </div>
    </>
  )
}
