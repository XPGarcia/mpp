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
  transactionType: TransactionType
  onSubmit: (data: CreateTransactionFormData) => void
}

export const CreateTransactionForm = ({ transactionType, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionFormData>({
    defaultValues: { typeId: getTransactionTypeId(transactionType) },
    resolver: zodResolver(schema),
  })

  const { categories } = useGetCategories(getTransactionTypeId(transactionType))

  return (
    <form className='flex flex-col gap-y-4' onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        type='datetime-local'
        label='Date'
        errorMessage={errors.date?.message}
        {...register("date", { valueAsDate: true })}
      />
      <FormInput
        type='number'
        label='Amount'
        errorMessage={errors.amount?.message}
        {...register("amount", { valueAsNumber: true })}
      />
      <FormInput
        type='text'
        label='Description'
        errorMessage={errors.description?.message}
        {...register("description")}
      />
      <FormSelect
        id='categories'
        label='Category'
        errorMessage={errors.categoryId?.message}
        options={categories.map((category) => ({ value: category.id, label: category.name }))}
        onChange={(categoryId) => setValue("categoryId", Number(categoryId))}
      />
      <div className='mt-2 flex flex-col gap-2'>
        <Button type='submit' isLoading={isSubmitting}>
          Save {transactionType === TransactionType.INCOME ? "Income" : "Expense"}
        </Button>
        <Button type='button' variant='ghost'>
          Cancel
        </Button>
      </div>
    </form>
  )
}
