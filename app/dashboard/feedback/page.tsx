"use client"

import { Button, FormInput } from "@/src/misc"
import { FormTextArea } from "@/src/misc/components/form-text-area/form-text-area"
import { trpc } from "@/src/utils/_trpc/client"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const schema = z.object({
  feedback: z.string().min(1, "The feedback message is required"),
})

type FeedbackFormData = z.infer<typeof schema>

export default function Feedback() {
  const { data: session } = useSession()
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
      await submitFeedback({ message: formData.feedback, userId: session?.user?.id ?? 0 })
      reset()
      toast.success("Thanks for sharing your thoughts! Your feedback has been received.", { duration: 5000 })
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(message)
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
