"use client"

import { Category, TransactionType } from "@/modules/transactions/types"
import { CreateCategoryFormData } from "@/src/categories/components/create-category-form/create-category-form"
import { CreateCategoryModalDrawer } from "@/src/categories/components/create-category-modal-drawer/create-category-modal-drawer"
import { DeleteCategoryDialogDrawer } from "@/src/categories/components/delete-category-dialog-drawer/delete-category-dialog-drawer"
import { useBoolean } from "@/src/misc/hooks/use-boolean"
import { SelectTransactionType } from "@/src/transactions/components/select-transaction-type"
import { useTransactionType } from "@/src/transactions/hooks/use-transaction-type"
import { Button } from "@/src/ui-lib/components/ui/button"
import { trpc } from "@/src/utils/_trpc/client"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

export default function CategoriesPage() {
  const { transactionType, setTransactionType } = useTransactionType()
  const { value: isOpenCategoryForm, on: openCategoryForm, off: closeCategoryForm } = useBoolean(false)
  const { value: isOpenDelete, on: openDeleteAction, off: closeDeleteAction } = useBoolean(false)

  const [selectedCategory, setSelectedCategory] = useState<CreateCategoryFormData & { id: number }>()

  const { data: categories, refetch: refetchCategories } = trpc.categories.findManyByUser.useQuery({ transactionType })

  const { mutateAsync: createCategory } = trpc.categories.createOneForUser.useMutation()

  const { mutateAsync: updateCategory } = trpc.categories.updateOne.useMutation()

  const { mutateAsync: deleteCategory } = trpc.categories.deleteOne.useMutation()

  const handleChangeTransactionType = (type: TransactionType) => {
    setTransactionType(type)
  }

  const onUpdateCategoryClicked = (category: Category) => {
    setSelectedCategory(category)
    openCategoryForm()
  }

  const onAddCategoryClicked = () => {
    setSelectedCategory(undefined)
    openCategoryForm()
  }

  const onDeleteCategoryClicked = (category: Category) => {
    setSelectedCategory(category)
    openDeleteAction()
  }

  const handleUpdateCategory = async (categoryId: number, data: CreateCategoryFormData) => {
    try {
      await updateCategory({ categoryId, ...data })
      toast.success("Category updated successfully")
      refetchCategories()
    } catch (error) {
      console.error(error)
      const errorMessage = getErrorMessage(error, "Failed to update category")
      toast.error(errorMessage)
    }
  }

  const handleCreateCategory = async (data: CreateCategoryFormData) => {
    try {
      await createCategory(data)
      toast.success("Category created successfully")
      refetchCategories()
    } catch (error) {
      console.error(error)
      const errorMessage = getErrorMessage(error, "Failed to update category")
      toast.error(errorMessage)
    }
  }

  const handleSetCategory = async (data: CreateCategoryFormData) => {
    if (selectedCategory) {
      await handleUpdateCategory(selectedCategory.id, data)
    } else {
      await handleCreateCategory(data)
    }

    setSelectedCategory(undefined)
    closeCategoryForm()
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      return
    }

    try {
      await deleteCategory({ categoryId: selectedCategory.id })
      toast.success("Category deleted successfully")
      refetchCategories()
    } catch (error) {
      console.error(error)
      const errorMessage = getErrorMessage(error, "Failed to delete category")
      toast.error(errorMessage)
    }

    setSelectedCategory(undefined)
    closeDeleteAction()
  }

  return (
    <main className='px-2 py-4'>
      <SelectTransactionType
        selectedType={transactionType}
        onIsIncomeClicked={() => handleChangeTransactionType(TransactionType.INCOME)}
        onIsExpenseClicked={() => handleChangeTransactionType(TransactionType.EXPENSE)}
      />
      <div className='mt-4'>
        {categories?.map((category) => (
          <div
            key={category.id}
            className='flex items-center justify-between rounded border-b border-gray-100 bg-white py-3 last:border-b-0'
          >
            <span>{category.name}</span>
            <div className='display flex items-center gap-2'>
              <Button
                style={{ borderRadius: "100%", padding: "0", height: "32px", width: "32px" }}
                onClick={() => onUpdateCategoryClicked(category)}
              >
                <Pencil size={16} />
              </Button>
              <Button
                style={{ borderRadius: "100%", padding: "0", height: "32px", width: "32px" }}
                onClick={() => onDeleteCategoryClicked(category)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-6'>
        <Button className='w-full' onClick={onAddCategoryClicked}>
          Create New Category
        </Button>
      </div>

      <CreateCategoryModalDrawer
        defaultValues={selectedCategory}
        isOpen={isOpenCategoryForm}
        onClose={closeCategoryForm}
        onSubmit={handleSetCategory}
      />
      <DeleteCategoryDialogDrawer isOpen={isOpenDelete} onClose={closeDeleteAction} onAccept={handleDeleteCategory} />
    </main>
  )
}
