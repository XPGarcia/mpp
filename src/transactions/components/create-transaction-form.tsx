"use client"

import { Button, FormInput } from "@/src/misc"
import { FormSelect } from "@/src/misc/components/form-select/form-select"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { SpendingType, TransactionType, TransactionFrequency, transactionFrequencyOptions } from "../types"
import { useState } from "react"
import { CreateCategoryFormData } from "@/src/categories/components/create-category-form/create-category-form"
import { Icon } from "@/src/misc/components/icons/icon"
import { trpc } from "@/src/utils/_trpc/client"
import { initialValueForFormDate } from "@/src/utils/format/forms"
import { adjustTimezoneFromLocalToUTC, adjustTimezoneFromUTCToLocal } from "@/src/utils/format/dates"
import { getValues } from "@/src/utils/format/zod-enums"
import { isIncome } from "@/src/utils/get-transaction-type-id"
import { SelectTransactionType } from "./select-transaction-type"
import { CreateCategoryModalDrawer } from "@/src/categories/components/create-category-modal-drawer/create-category-modal-drawer"
import { FormCheckbox } from "@/src/misc/components/form-checkbox/form-checkbox"

const schema = z.object({
  date: z.date().refine((date) => date != null, { message: "Date is required and must be a valid date" }),
  amount: z
    .number({ message: "Amount must be a number" })
    .positive("Amount must be positive")
    .gt(0, "Amount is required"),
  type: z.enum(getValues(TransactionType), { message: "Select a valid type for transaction" }),
  categoryId: z.number().positive("Category is required").min(1, "Category is required"),
  description: z.string(),
  isRecurrent: z.boolean().default(false),
  frequency: z
    .enum(getValues(TransactionFrequency), { message: "Select a valid frequency for transaction" })
    .optional(),
})

export type CreateTransactionFormData = z.infer<typeof schema>

interface Props {
  initialValues?: CreateTransactionFormData
  withFrequency?: boolean
  onSubmit: (data: CreateTransactionFormData) => void
  onCancel: () => void
}

export const CreateTransactionForm = ({ initialValues, withFrequency = true, onSubmit, onCancel }: Props) => {
  const [openCategoryForm, setOpenCategoryForm] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionFormData>({
    defaultValues: {
      type: initialValues?.type ?? TransactionType.EXPENSE,
      date: initialValueForFormDate(initialValues?.date ?? adjustTimezoneFromUTCToLocal(new Date())),
      amount: initialValues?.amount,
      categoryId: initialValues?.categoryId,
      description: initialValues?.description,
      isRecurrent: initialValues?.isRecurrent ?? false,
      frequency: initialValues?.frequency,
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const transactionType = getValues().type

  const { data: categories, refetch: refetchCategories } = trpc.categories.findManyByUser.useQuery({
    transactionType: transactionType,
  })

  const { mutateAsync: createCategoryForUser } = trpc.categories.createOneForUser.useMutation()

  const submit = (data: CreateTransactionFormData) => {
    reset()
    onSubmit({ ...data, date: adjustTimezoneFromLocalToUTC(data.date) })
  }

  const handleCreateCategory = async (data: CreateCategoryFormData) => {
    const category = await createCategoryForUser(data)
    if (category) {
      await refetchCategories()
      setValue("categoryId", category.id)
    }
    setOpenCategoryForm(false)
  }

  const handleChangeTransactionType = (type: TransactionType) => {
    // @ts-ignore - we want to remove the category ID
    setValue("categoryId", undefined)
    setValue("type", type)
    trigger("type")
  }

  return (
    <>
      <SelectTransactionType
        selectedType={transactionType}
        onIsIncomeClicked={() => handleChangeTransactionType(TransactionType.INCOME)}
        onIsExpenseClicked={() => handleChangeTransactionType(TransactionType.EXPENSE)}
      />
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
            <p className='ml-1'>New Category</p>
          </Button>
        </div>

        <FormInput
          type='text'
          label='Description'
          errorMessage={errors.description?.message}
          {...register("description")}
        />

        {withFrequency && (
          <>
            <Controller
              control={control}
              name='isRecurrent'
              render={({ field }) => (
                <FormCheckbox
                  id='isRecurrent'
                  label='Is a recurrent transaction?'
                  isChecked={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {watch("isRecurrent") && (
              <Controller
                control={control}
                name='frequency'
                render={({ field }) => (
                  <FormSelect
                    id='frequencies'
                    label='Frequency'
                    defaultValue={field.value?.toString()}
                    errorMessage={errors.frequency?.message}
                    options={transactionFrequencyOptions.map((frequency) => ({
                      value: frequency.value,
                      label: frequency.label,
                    }))}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
          </>
        )}

        <div className='mt-3 flex flex-col gap-2'>
          <Button type='submit' isLoading={isSubmitting}>
            Save {isIncome(transactionType) ? "Income" : "Expense"}
          </Button>
          <Button type='button' variant='ghost' onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
      <CreateCategoryModalDrawer
        defaultValues={{
          name: "",
          transactionType,
          spendingType: isIncome(transactionType) ? SpendingType.NO_APPLY : SpendingType.NECESSITY,
        }}
        isOpen={openCategoryForm}
        onClose={() => setOpenCategoryForm(false)}
        onSubmit={handleCreateCategory}
      />
    </>
  )
}
