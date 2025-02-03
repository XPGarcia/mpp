import { Dialog, DialogClose,DialogContent, DialogHeader, DialogTitle } from "@/src/ui-lib/components/ui/dialog"
import { Drawer, DrawerClose,DrawerContent, DrawerHeader, DrawerTitle } from "@/src/ui-lib/components/ui/drawer"
import useMediaQuery from "@/src/ui-lib/hooks/use-media-query"

import { CreateCategoryForm, CreateCategoryFormData } from "../create-category-form/create-category-form"

interface Props {
  defaultValues?: CreateCategoryFormData
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateCategoryFormData) => void
}

export const CreateCategoryModalDrawer = ({ defaultValues, isOpen, onClose, onSubmit }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const title = defaultValues ? "Edit category" : "Create a new category"

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='p-4 sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <CreateCategoryForm defaultValues={defaultValues} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerClose />
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className='p-4 pt-2'>
          <CreateCategoryForm defaultValues={defaultValues} onSubmit={onSubmit} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
