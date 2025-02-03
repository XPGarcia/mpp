import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/src/ui-lib/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/ui-lib/components/ui/form"
import { Input } from "@/src/ui-lib/components/ui/input"
import { Slider } from "@/src/ui-lib/components/ui/slider"

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
  const form = useForm<CreateBudgetFormData>({
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
    <Form {...form}>
      <form className='mt-4 flex w-full flex-col gap-4' onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Balanced Budget' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='living'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Living</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  max={100}
                  step={1}
                  onValueChange={(e) => field.onChange(e[0])}
                  showValue
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='savings'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Savings/Investments</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  max={100}
                  step={1}
                  onValueChange={(e) => field.onChange(e[0])}
                  showValue
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='entertainment'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entertainment</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  max={100}
                  step={1}
                  onValueChange={(e) => field.onChange(e[0])}
                  showValue
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!form.formState.errors.total && (
          <p className='text-xs text-gray-500'>
            *Living, expenses, and entertainment categories divide your monthly budget. Ensure their total equals 100%
            of your monthly expenses
          </p>
        )}
        {form.formState.errors.total && <p className='text-xs text-red-500'>{form.formState.errors.total.message}</p>}
        <Button type='submit' isLoading={form.formState.isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  )
}
