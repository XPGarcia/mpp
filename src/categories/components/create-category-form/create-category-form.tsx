import { SpendingType, TransactionType } from "@/modules/transactions/types"
import { getValues } from "@/src/utils/format/zod-enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { spendingTypeOptions, transactionTypeOptions } from "@/src/transactions/constants"
import { isExpense, isIncome } from "@/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/ui-lib/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui-lib/components/ui/select"
import { Input } from "@/src/ui-lib/components/ui/input"
import { Button } from "@/src/ui-lib/components/ui/button"

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
  const form = useForm<CreateCategoryFormData>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      transactionType: defaultValues?.transactionType,
      spendingType: defaultValues?.spendingType,
    },
    resolver: zodResolver(schema),
  })
  const transactionType = form.watch("transactionType")

  useEffect(() => {
    form.reset({
      name: defaultValues?.name ?? "",
      transactionType: defaultValues?.transactionType,
      spendingType: defaultValues?.spendingType,
    })
  }, [defaultValues, form])

  const submit = (data: CreateCategoryFormData) => {
    form.reset()
    onSubmit(data)
  }

  const handleChangeTransactionType = (type: TransactionType) => {
    if (isIncome(type)) {
      form.setValue("spendingType", SpendingType.NO_APPLY)
    } else if (isExpense(type)) {
      form.resetField("spendingType", { defaultValue: undefined })
    }
    form.trigger("spendingType")
  }

  return (
    <Form {...form}>
      <form className='flex flex-col gap-3' onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Food...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='transactionType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  handleChangeTransactionType(value as TransactionType)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a frequency' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transactionTypeOptions.map((transactionType) => (
                    <SelectItem key={transactionType.value} value={transactionType.value}>
                      {transactionType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {isExpense(transactionType) && (
          <FormField
            control={form.control}
            name='spendingType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spending Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a frequency' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {spendingTypeOptions.map((spendingType) => (
                      <SelectItem key={spendingType.value} value={spendingType.value}>
                        {spendingType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type='submit' isLoading={form.formState.isSubmitting} className='mt-2'>
          Save
        </Button>
      </form>
    </Form>
  )
}
