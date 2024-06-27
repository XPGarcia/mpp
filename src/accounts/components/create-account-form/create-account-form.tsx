import { Button, FormInput } from "@/src/misc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Account name is required"),
  startingBalance: z.number().min(0, "Starting balance must be positive"),
  currency: z.enum(["USD"]),
})

export type CreateAccountFormData = z.infer<typeof schema>

interface Props {
  initialValues?: CreateAccountFormData
  onSubmit: (data: CreateAccountFormData) => void
}

export const CreateAccountForm = ({ initialValues, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormData>({
    defaultValues: {
      name: initialValues?.name ?? "Personal account",
      startingBalance: initialValues?.startingBalance ?? 0,
      currency: "USD",
    },
    resolver: zodResolver(schema),
  })

  const submit = (data: CreateAccountFormData) => {
    onSubmit(data)
  }

  return (
    <form className='mt-6 flex flex-col gap-4' onSubmit={handleSubmit(submit)}>
      <FormInput label='Account Name' errorMessage={errors.name?.message} {...register("name")} />
      <FormInput
        label='Starting Balance'
        type='number'
        step='0.01'
        leftElement={"$"}
        errorMessage={errors.startingBalance?.message}
        helperText='This will be used to calculate your initial account balance'
        {...register("startingBalance", { valueAsNumber: true })}
      />
      <FormInput label='Currency' disabled {...register("currency")} />
      <Button type='submit' isLoading={isSubmitting} className='mt-2'>
        Save
      </Button>
    </form>
  )
}
