import { BottomDrawer } from "@/src/misc/components/bottom-drawer/bottom-drawer"
import { CreateCategoryForm, CreateCategoryFormData } from "../create-category-form/create-category-form"
import { Modal } from "@/src/misc/components/modal/modal"
import { TransactionType } from "@/src/transactions/types"

interface Props {
  defaultValues?: CreateCategoryFormData
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateCategoryFormData) => void
}

export const CreateCategoryModalDrawer = ({ defaultValues, isOpen, onClose, onSubmit }: Props) => {
  return (
    <>
      <div className='block md:hidden'>
        <BottomDrawer isOpen={isOpen} onClose={onClose}>
          <CreateCategoryForm defaultValues={defaultValues} onSubmit={onSubmit} />
        </BottomDrawer>
      </div>
      <div className='hidden md:block'>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <CreateCategoryForm defaultValues={defaultValues} onSubmit={onSubmit} />
        </Modal>
      </div>
    </>
  )
}
