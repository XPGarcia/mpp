"use client"

import { Button, FormInput } from "@/src/misc"
import { FormSelect } from "@/src/misc/components/form-select/form-select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { TransactionType } from "../types"
import { useGetCategories } from "@/src/categories/hooks/use-get-categories"
import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"

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

  const { categories } = useGetCategories(transactionType)

  const submit = (data: CreateTransactionFormData) => {
    reset()
    onSubmit(data)
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
        <FormSelect
          id='categories'
          label='Category'
          errorMessage={errors.categoryId?.message}
          options={categories.map((category) => ({ value: category.id, label: category.name }))}
          onChange={(categoryId) => setValue("categoryId", Number(categoryId))}
        />
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
    </>
  )
}
