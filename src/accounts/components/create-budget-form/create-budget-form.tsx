import { Button, FormInput } from "@/src/misc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    living: z.number().min(0, "Living must be positive").max(100, "Living must be less than 100"),
    savings: z.number().min(0, "Savings must be positive").max(100, "Savings must be less than 100"),
    entertainment: z.number().min(0, "Entertainment must be positive").max(100, "Entertainment must be less than 100"),
    total: z.number().optional(),
  })
  .refine((data) => data.living + data.savings + data.entertainment === 100, {
    message: "The sum of living, savings, and entertainment must be 100",
    path: ["total"],
  })

export type CreateBudgetFormData = z.infer<typeof schema>

interface Props {
  initialValues?: CreateBudgetFormData
  onSubmit: (data: CreateBudgetFormData) => void
}

export const CreateBudgetForm = ({ initialValues, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateBudgetFormData>({
    defaultValues: {
      name: initialValues?.name ?? "Balanced",
      living: initialValues?.living ?? 50,
      savings: initialValues?.savings ?? 30,
      entertainment: initialValues?.entertainment ?? 20,
    },
    resolver: zodResolver(schema),
  })

  const submit = (data: CreateBudgetFormData) => {
    onSubmit(data)
  }

  return (
    <form className='mt-4 flex w-full flex-col gap-4' onSubmit={handleSubmit(submit)}>
      <FormInput label='Name' errorMessage={errors.name?.message} {...register("name")} />
      <FormInput
        type='number'
        step='5'
        min='0'
        max='100'
        label='Living'
        errorMessage={errors.living?.message}
        {...register("living", { valueAsNumber: true })}
      />
      <FormInput
        type='number'
        step='5'
        min='0'
        max='100'
        label='Savings/Investments'
        errorMessage={errors.savings?.message}
        {...register("savings", { valueAsNumber: true })}
      />
      <FormInput
        type='number'
        step='5'
        min='0'
        max='100'
        label='Entertainment'
        errorMessage={errors.entertainment?.message}
        {...register("entertainment", { valueAsNumber: true })}
      />
      {!errors.total && (
        <p className='text-xs text-gray-500'>
          *Living, expenses, and entertainment categories divide your monthly budget. Ensure their total equals 100% of
          your monthly expenses
        </p>
      )}
      {errors.total && <p className='text-sm text-red-500'>{errors.total.message}</p>}
      <Button type='submit' isLoading={isSubmitting}>
        Save
      </Button>
    </form>
  )
}
