import { Button } from "@/src/ui-lib/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/ui-lib/components/ui/form"
import { Input } from "@/src/ui-lib/components/ui/input"
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
  const form = useForm<CreateAccountFormData>({
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
    <Form {...form}>
      <form className='mt-6 flex flex-col gap-4' onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder='My personal account' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='startingBalance'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Balance</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='My personal account'
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>This will be used to calculate your initial account balance</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='currency'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormDescription>This will be used to calculate your initial account balance</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' isLoading={form.formState.isSubmitting} className='mt-2'>
          Save
        </Button>
      </form>
    </Form>
  )
}
