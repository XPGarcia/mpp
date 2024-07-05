import { Button, FormInput } from "@/src/misc"
import { TransactionType } from "@/src/transactions/types"
import { getValues } from "@/src/utils/format/zod-enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Category Name is required"),
  transactionType: z.enum(getValues(TransactionType), { message: "Select a valid type for transaction" }),
})

export type CreateCategoryFormData = z.infer<typeof schema>

interface Props {
  defaultValues?: CreateCategoryFormData
  onSubmit: (data: CreateCategoryFormData) => void
}

export const CreateCategoryForm = ({ defaultValues, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormData>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      transactionType: defaultValues?.transactionType ?? TransactionType.EXPENSE,
    },
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    reset({
      name: defaultValues?.name ?? "",
      transactionType: defaultValues?.transactionType ?? TransactionType.EXPENSE,
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
      <Button type='submit' isLoading={isSubmitting}>
        Save
      </Button>
    </form>
  )
}
