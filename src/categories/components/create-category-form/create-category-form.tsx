import { Button, FormInput } from "@/src/misc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Category Name is required"),
  transactionTypeId: z.number().positive("Transaction type is required").min(1, "Transaction type is required"),
})

export type CreateCategoryFormData = z.infer<typeof schema>

interface Props {
  transactionTypeId: number
  onSubmit: (data: CreateCategoryFormData) => void
}

export const CreateCategoryForm = ({ transactionTypeId, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormData>({
    defaultValues: {
      name: "",
      transactionTypeId,
    },
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    reset({ name: "", transactionTypeId })
  }, [transactionTypeId, reset])

  const submit = (data: CreateCategoryFormData) => {
    reset()
    onSubmit(data)
  }

  return (
    <form className='flex flex-col gap-3' onSubmit={handleSubmit(submit)}>
      <FormInput
        type='text'
        label='Category Name'
        placeholder='Food'
        errorMessage={errors.name?.message}
        {...register("name")}
      />
      <Button type='submit' isLoading={isSubmitting}>
        Create
      </Button>
    </form>
  )
}
