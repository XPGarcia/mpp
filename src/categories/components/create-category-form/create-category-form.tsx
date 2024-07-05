import { Button, FormInput } from "@/src/misc"
import { FormSelect } from "@/src/misc/components/form-select/form-select"
import { SpendingType, TransactionType, spendingTypeOptions, transactionTypeOptions } from "@/src/transactions/types"
import { getValues } from "@/src/utils/format/zod-enums"
import { isExpense, isIncome } from "@/src/utils/get-transaction-type-id"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Category Name is required"),
  transactionType: z.enum(getValues(TransactionType), { message: "Select a valid type for transaction" }),
  spendingType: z.enum(getValues(SpendingType), { message: "Select a valid spending type" }),
})

export type CreateCategoryFormData = z.infer<typeof schema>

interface Props {
  defaultValues?: CreateCategoryFormData
  onSubmit: (data: CreateCategoryFormData) => void
}

export const CreateCategoryForm = ({ defaultValues, onSubmit }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormData>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      transactionType: defaultValues?.transactionType,
      spendingType: defaultValues?.spendingType,
    },
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    reset({
      name: defaultValues?.name ?? "",
      transactionType: defaultValues?.transactionType,
      spendingType: defaultValues?.spendingType,
    })
  }, [defaultValues, reset])

  const submit = (data: CreateCategoryFormData) => {
    reset()
    onSubmit(data)
  }

  return (
    <form className='flex flex-col gap-3' onSubmit={handleSubmit(submit)}>
      <FormInput
        type='text'
        label='Name'
        placeholder='Food...'
        errorMessage={errors.name?.message}
        {...register("name")}
      />
      <Controller
        control={control}
        name='transactionType'
        render={({ field }) => (
          <FormSelect
            id='transactionTypes'
            label='Transaction Type'
            defaultValue={field.value}
            errorMessage={errors.transactionType?.message}
            options={transactionTypeOptions}
            onChange={(value) => {
              const type = value as TransactionType
              field.onChange(type)
              if (isIncome(type)) {
                setValue("spendingType", SpendingType.NO_APPLY)
              } else if (isExpense(type)) {
                // @ts-ignore - we want to reset the spendingType
                setValue("spendingType", undefined)
              }
              trigger("spendingType")
            }}
          />
        )}
      />
      {isExpense(getValues("transactionType")) && (
        <Controller
          control={control}
          name='spendingType'
          render={({ field }) => (
            <FormSelect
              id='spendingTypes'
              label='Spending Type'
              defaultValue={field.value}
              errorMessage={errors.spendingType?.message}
              options={spendingTypeOptions}
              onChange={field.onChange}
            />
          )}
        />
      )}
      <Button type='submit' isLoading={isSubmitting} className='mt-2'>
        Save
      </Button>
    </form>
  )
}
