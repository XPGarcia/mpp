"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { CalendarIcon, Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { SpendingType, TransactionFrequency, TransactionType } from "@/modules/transactions/types"
import { CreateCategoryFormData } from "@/src/categories/components/create-category-form/create-category-form"
import { CreateCategoryModalDrawer } from "@/src/categories/components/create-category-modal-drawer/create-category-modal-drawer"
import { Button } from "@/src/ui-lib/components/ui/button"
import { Calendar } from "@/src/ui-lib/components/ui/calendar"
import { Checkbox } from "@/src/ui-lib/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/ui-lib/components/ui/form"
import { Input } from "@/src/ui-lib/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/ui-lib/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui-lib/components/ui/select"
import { cn } from "@/src/ui-lib/lib/utils"
import { trpc } from "@/src/utils/_trpc/client"
import { getValues } from "@/src/utils/format/zod-enums"
import { isIncome } from "@/utils"

import { transactionFrequencyOptions } from "../constants"
import { SelectTransactionType } from "./select-transaction-type"

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
  hasEndOccurrences: z.boolean().default(false),
  totalOccurrences: z.number().int().min(1).optional(),
})

export type CreateTransactionFormData = z.infer<typeof schema>

interface Props {
  initialValues?: CreateTransactionFormData
  currentOccurrence?: number
  withFrequency?: boolean
  onSubmit: (data: CreateTransactionFormData) => void
  onCancel: () => void
}

export const CreateTransactionForm = ({ initialValues, currentOccurrence, withFrequency = true, onSubmit, onCancel }: Props) => {
  const [openCategoryForm, setOpenCategoryForm] = useState(false)
  const form = useForm<CreateTransactionFormData>({
    defaultValues: {
      type: initialValues?.type ?? TransactionType.EXPENSE,
      date: initialValues?.date ?? new Date(),
      amount: initialValues?.amount,
      categoryId: initialValues?.categoryId,
      description: initialValues?.description ?? "",
      isRecurrent: initialValues?.isRecurrent ?? false,
      frequency: initialValues?.frequency,
      hasEndOccurrences: initialValues?.hasEndOccurrences ?? false,
      totalOccurrences: initialValues?.totalOccurrences,
    },
    resolver: zodResolver(schema),
  })

  const transactionType = form.watch("type")

  const { data: categories, refetch: refetchCategories } = trpc.categories.findManyByUser.useQuery({
    transactionType: transactionType,
  })

  const { mutateAsync: createCategoryForUser } = trpc.categories.createOneForUser.useMutation()

  const submit = (data: CreateTransactionFormData) => {
    if (currentOccurrence != null && data.totalOccurrences != null && data.totalOccurrences < currentOccurrence) {
      form.setError("totalOccurrences", {
        message: `Total occurrences cannot be less than current occurrence (${currentOccurrence})`,
      })
      return
    }
    if (!initialValues) {
      form.reset()
    }
    const { hasEndOccurrences: _, ...rest } = data
    onSubmit(rest as CreateTransactionFormData)
  }

  const handleCreateCategory = async (data: CreateCategoryFormData) => {
    const category = await createCategoryForUser(data)
    if (category) {
      await refetchCategories()
      form.setValue("categoryId", category.id)
    }
    setOpenCategoryForm(false)
  }

  const handleChangeTransactionType = (type: TransactionType) => {
    // @ts-expect-error - we want to remove the category ID
    form.setValue("categoryId", undefined)
    form.setValue("type", type)
    form.trigger("type")
  }

  return (
    <>
      <SelectTransactionType
        selectedType={transactionType}
        onIsIncomeClicked={() => handleChangeTransactionType(TransactionType.INCOME)}
        onIsExpenseClicked={() => handleChangeTransactionType(TransactionType.EXPENSE)}
      />
      <Form {...form}>
        <form className='mt-4 flex flex-col gap-y-4' onSubmit={form.handleSubmit(submit)}>
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {dayjs(field.value).format("DD-MM-YYYY")}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='relative flex items-end gap-2'>
            <FormField
              key={categories?.length}
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className={`shrink-0 ${form.formState.errors.categoryId ? "mb-[27px]" : ""}`}
              onClick={() => setOpenCategoryForm(true)}
            >
              <Plus />
              <p>New</p>
            </Button>
          </div>

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {withFrequency && (
            <>
              <FormField
                control={form.control}
                name='isRecurrent'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 py-4'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={Boolean(initialValues?.isRecurrent)}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Is a recurrent transaction?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("isRecurrent") && (
                <>
                  <FormField
                    control={form.control}
                    name='frequency'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a frequency' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {transactionFrequencyOptions.map((frequencyOption) => (
                              <SelectItem key={frequencyOption.value} value={frequencyOption.value}>
                                {frequencyOption.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='hasEndOccurrences'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-start space-x-3 space-y-0 py-4'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={Boolean(initialValues?.hasEndOccurrences)}
                          />
                        </FormControl>
                        <div className='space-y-1 leading-none'>
                          <FormLabel>Ends after a number of occurrences</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("hasEndOccurrences") && (
                    <FormField
                      control={form.control}
                      name='totalOccurrences'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total occurrences</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              min={currentOccurrence ?? 1}
                              step={1}
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          {currentOccurrence != null && (
                            <p className='text-sm text-muted-foreground'>
                              Current occurrence: {currentOccurrence}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
            </>
          )}

          <div className='mt-3 flex flex-col gap-2'>
            <Button type='submit' isLoading={form.formState.isSubmitting}>
              Save {isIncome(transactionType) ? "Income" : "Expense"}
            </Button>
            <Button type='button' variant='ghost' onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
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
