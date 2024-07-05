"use client"

import { CreateCategoryFormData } from "@/src/categories/components/create-category-form/create-category-form"
import { CreateCategoryModalDrawer } from "@/src/categories/components/create-category-modal-drawer/create-category-modal-drawer"
import { Category } from "@/src/categories/types"
import { Button } from "@/src/misc"
import { Icon } from "@/src/misc/components/icons/icon"
import { useBoolean } from "@/src/misc/hooks/use-boolean"
import { SelectTransactionType } from "@/src/transactions/components/select-transaction-type"
import { useTransactionType } from "@/src/transactions/hooks/use-transaction-type"
import { TransactionType } from "@/src/transactions/types"
import { trpc } from "@/src/utils/_trpc/client"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { useState } from "react"
import toast from "react-hot-toast"

export default function CategoriesPage() {
  const { transactionType, setTransactionType } = useTransactionType()
  const { value: isOpenCategoryForm, on: openCategoryForm, off: closeCategoryForm } = useBoolean(false)

  const [selectedCategory, setSelectedCategory] = useState<CreateCategoryFormData & { id: number }>()

  const { data: categories, refetch: refetchCategories } = trpc.categories.findManyByUser.useQuery({ transactionType })

  const { mutateAsync: updateCategory } = trpc.categories.updateOne.useMutation()

  const handleChangeTransactionType = (type: TransactionType) => {
    setTransactionType(type)
  }

  const onUpdateCategoryClicked = (category: Category) => {
    setSelectedCategory({
      id: category.id,
      name: category.name,
      transactionType,
    })
    openCategoryForm()
  }

  const handleUpdateCategory = async (data: CreateCategoryFormData) => {
    if (!selectedCategory) {
      return
    }

    try {
      await updateCategory({ categoryId: selectedCategory.id, ...data })
      toast.success("Category updated successfully")
      refetchCategories()
    } catch (error) {
      console.error(error)
      const errorMessage = getErrorMessage(error, "Failed to update category")
      toast.error(errorMessage)
    }

    setSelectedCategory(undefined)
    closeCategoryForm()
  }

  return (
    <main className='px-2 py-4'>
      <SelectTransactionType
        selectedType={transactionType}
        onIsIncomeClicked={() => handleChangeTransactionType(TransactionType.INCOME)}
        onIsExpenseClicked={() => handleChangeTransactionType(TransactionType.EXPENSE)}
      />
      <h1 className='mt-4 text-xl font-medium text-shades-500'>Categories</h1>
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
                <Icon icon='pencil' size='sm' />
              </Button>
              <Button
                style={{ borderRadius: "100%", padding: "0", height: "32px", width: "32px" }}
                className='bg-red-500'
              >
                <Icon icon='trash' size='sm' />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <CreateCategoryModalDrawer
        defaultValues={selectedCategory}
        isOpen={isOpenCategoryForm}
        onClose={closeCategoryForm}
        onSubmit={handleUpdateCategory}
      />
    </main>
  )
}
