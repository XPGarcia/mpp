"use client"

import { Button, FormInput } from "@/src/misc"
import { FormSelect } from "@/src/misc/components/form-select/form-select"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { TransactionType } from "../types"
import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"
import { BottomDrawer } from "@/src/misc/components/bottom-drawer/bottom-drawer"
import { useState } from "react"
import {
  CreateCategoryForm,
  CreateCategoryFormData,
} from "@/src/categories/components/create-category-form/create-category-form"
import { Modal } from "@/src/misc/components/modal/modal"
import { Icon } from "@/src/misc/components/icons/icon"
import { trpc } from "@/src/utils/_trpc/client"
import { initialValueForFormDate } from "@/src/utils/format/forms"
import { adjustTimezone } from "@/src/utils/format/dates"

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
  initialValues?: CreateTransactionFormData
  onSubmit: (data: CreateTransactionFormData) => void
  onCancel: () => void
}

export const CreateTransactionForm = ({ initialValues, onSubmit, onCancel }: Props) => {
  const [openCategoryForm, setOpenCategoryForm] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionFormData>({
    defaultValues: {
      typeId: initialValues?.typeId ?? getTransactionTypeId(TransactionType.EXPENSE),
      date: initialValueForFormDate(initialValues?.date ?? new Date()),
      amount: initialValues?.amount,
      categoryId: initialValues?.categoryId,
      description: initialValues?.description,
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const transactionType = getValues().typeId

  const { data: categories, refetch: refetchCategories } = trpc.categories.findManyByUser.useQuery({
    transactionTypeId: transactionType,
  })

  const { mutateAsync: createCategoryForUser } = trpc.categories.createOneForUser.useMutation()

  const submit = (data: CreateTransactionFormData) => {
    reset()
    onSubmit({ ...data, date: adjustTimezone(data.date) })
  }

  const handleCreateCategory = async (data: CreateCategoryFormData) => {
    const category = await createCategoryForUser(data)
    if (category) {
      await refetchCategories()
      setValue("categoryId", category.id)
    }
    setOpenCategoryForm(false)
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
          type='date'
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
          <Controller
            control={control}
            name='categoryId'
            render={({ field }) => (
              <FormSelect
                id='categories'
                label='Category'
                defaultValue={field.value?.toString()}
                errorMessage={errors.categoryId?.message}
                options={categories?.map((category) => ({ value: category.id.toString(), label: category.name })) ?? []}
                onChange={(val) => field.onChange(Number(val))}
              />
            )}
          />

          <Button size='sm' className='float-right mt-2' onClick={() => setOpenCategoryForm(true)}>
            <Icon icon='plus' />
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
      <div className='block md:hidden'>
        <BottomDrawer
          isOpen={openCategoryForm}
          onClose={() => setOpenCategoryForm(false)}
          title={`New ${transactionType === getTransactionTypeId(TransactionType.INCOME) ? "income" : "expense"} category`}
        >
          <CreateCategoryForm transactionTypeId={transactionType} onSubmit={handleCreateCategory} />
        </BottomDrawer>
      </div>
      <div className='hidden md:block'>
        <Modal
          isOpen={openCategoryForm}
          onClose={() => setOpenCategoryForm(false)}
          title={`New ${transactionType === getTransactionTypeId(TransactionType.INCOME) ? "income" : "expense"} category`}
          isCentered
        >
          <CreateCategoryForm transactionTypeId={transactionType} onSubmit={handleCreateCategory} />
        </Modal>
      </div>
    </>
  )
}
