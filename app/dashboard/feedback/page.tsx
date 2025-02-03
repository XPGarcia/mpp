"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { FormTextArea } from "@/src/misc/components/form-text-area/form-text-area"
import { Button } from "@/src/ui-lib/components/ui/button"
import { useToast } from "@/src/ui-lib/hooks/use-toast"
import { trpc } from "@/src/utils/_trpc/client"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"

const schema = z.object({
  feedback: z.string().min(1, "The feedback message is required"),
})

type FeedbackFormData = z.infer<typeof schema>

export default function Feedback() {
  const { toast } = useToast()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    defaultValues: { feedback: "" },
    resolver: zodResolver(schema),
  })

  const { mutateAsync: submitFeedback } = trpc.feedbacks.submitOne.useMutation()
  const submit = async (formData: FeedbackFormData) => {
    try {
      await submitFeedback({ message: formData.feedback })
      reset()
      toast({ description: "Thanks for sharing your thoughts! Your feedback has been received." })
    } catch (error) {
      const message = getErrorMessage(error)
      toast({ description: message, variant: "destructive" })
    }
  }

  return (
    <main className='flex flex-col pt-4'>
      <h1 className='text-xl font-semibold text-shades-500'>We Value Your Opinion!</h1>
      <p className='mt-1 text-base font-medium text-shades-200'>
        Help us improve by sharing your thoughts. Your feedback makes a difference!
      </p>
      <form className='mt-4 flex flex-col gap-4' onSubmit={handleSubmit(submit)}>
        <FormTextArea
          placeholder='Your feedback here...'
          errorMessage={errors.feedback?.message}
          {...register("feedback")}
        />
        <Button type='submit' isLoading={isSubmitting}>
          Submit
        </Button>
      </form>
    </main>
  )
}
