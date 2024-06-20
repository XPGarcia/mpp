"use client"

import { Button, FormInput } from "@/src/misc"
import { FormSelect } from "@/src/misc/components/form-select/form-select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { TransactionType } from "../types"
import { useGetCategories } from "@/src/categories/hooks/use-get-categories"
import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"
import { PlusIcon } from "@/src/misc/components/icons/plus-icon"
import { BottomDrawer } from "@/src/misc/components/bottom-drawer/bottom-drawer"
import { useState } from "react"
import {
  CreateCategoryForm,
  CreateCategoryFormData,
} from "@/src/categories/components/create-category-form/create-category-form"
import { useCreateCategoryForUser } from "@/src/categories/hooks/use-create-categories-for-user"

const schema = z.object({
  date: z.date().refine((date) => date != null, { message: "Date is required and must be a valid date" }),
  amount: z
    .number({ message: "Amount must be a number" })
    .positive("Amount must be positive")
    .min(1, "Amount is required"),
  typeId: z.number().positive("Type is required").min(1, "Type is required"),
  categoryId: z.number().positive("Category is required").min(1, "Category is required"),
  description: z.string(),
})

export type CreateTransactionFormData = z.infer<typeof schema>

interface Props {
  onSubmit: (data: CreateTransactionFormData) => void
  onCancel: () => void
}

export const CreateTransactionForm = ({ onSubmit, onCancel }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionFormData>({
    defaultValues: {
      typeId: getTransactionTypeId(TransactionType.INCOME),
      date: undefined,
      amount: undefined,
      categoryId: undefined,
      description: undefined,
    },
    resolver: zodResolver(schema),
  })

  const transactionType = getValues().typeId

  const { categories, refetch } = useGetCategories(transactionType)

  const { createCategoryForUser } = useCreateCategoryForUser()

  const submit = (data: CreateTransactionFormData) => {
    reset()
    onSubmit(data)
  }

  const handleCreateCategory = async (data: CreateCategoryFormData) => {
    const category = await createCategoryForUser(data)
    if (category) {
      refetch()
    }
    setIsDrawerOpen(false)
  }

  return (
    <>
      <div className='flex w-full justify-center gap-3'>
        <Button
          size='sm'
          variant={transactionType === getTransactionTypeId(TransactionType.INCOME) ? "solid" : "outline"}
          onClick={() => {
            setValue("typeId", getTransactionTypeId(TransactionType.INCOME))
            trigger("typeId")
          }}
        >
          Income
        </Button>
        <Button
          size='sm'
          variant={transactionType === getTransactionTypeId(TransactionType.EXPENSE) ? "solid" : "outline"}
          onClick={() => {
            setValue("typeId", getTransactionTypeId(TransactionType.EXPENSE))
            trigger("typeId")
          }}
        >
          Expense
        </Button>
      </div>
      <form className='mt-4 flex flex-col gap-y-4' onSubmit={handleSubmit(submit)}>
        <FormInput
          type='datetime-local'
          label='Date'
          errorMessage={errors.date?.message}
          {...register("date", { valueAsDate: true })}
        />
        <FormInput
          type='number'
          step='0.01'
          label='Amount'
          errorMessage={errors.amount?.message}
          leftElement={<span className='text-shades-200'>$</span>}
          {...register("amount", { valueAsNumber: true })}
        />
        <div className='relative'>
          <FormSelect
            id='categories'
            label='Category'
            errorMessage={errors.categoryId?.message}
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
            onChange={(categoryId) => setValue("categoryId", Number(categoryId))}
          />
          <Button size='sm' className='float-right mt-2' onClick={() => setIsDrawerOpen(true)}>
            <PlusIcon />
          </Button>
        </div>

        <FormInput
          type='text'
          label='Description'
          errorMessage={errors.description?.message}
          {...register("description")}
        />

        <div className='mt-2 flex flex-col gap-2'>
          <Button type='submit' isLoading={isSubmitting}>
            Save {transactionType === getTransactionTypeId(TransactionType.INCOME) ? "Income" : "Expense"}
          </Button>
          <Button type='button' variant='ghost' onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
      <BottomDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Want to create a new ${transactionType === getTransactionTypeId(TransactionType.INCOME) ? "income" : "expense"}?`}
      >
        <CreateCategoryForm transactionTypeId={transactionType} onSubmit={handleCreateCategory} />
      </BottomDrawer>
    </>
  )
}
