"use client"

import { FormInput, Button } from "@/src/misc"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof schema>

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schema),
  })
  const router = useRouter()

  const submit = async (formData: LoginFormData) => {
    console.log(formData)
    const response = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })
    if (!response || response?.error) {
      toast.error(response?.error || "An error occurred")
    } else {
      toast.success("Logged in successfully")
      router.replace("/")
    }
  }

  return (
    <form className='flex flex-col gap-y-4 py-5' onSubmit={handleSubmit(submit)}>
      <FormInput
        size='lg'
        label='Email'
        type='email'
        placeholder='Email'
        errorMessage={errors.email?.message}
        {...register("email")}
      />
      <FormInput
        size='lg'
        label='Password'
        type='password'
        placeholder='Password'
        errorMessage={errors.password?.message}
        {...register("password")}
      />
      <Button type='submit' size='lg' className='mt-1' isLoading={isSubmitting}>
        Login
      </Button>
      <div className='text-center text-xs text-neutral-500'>
        {`Don't have an account yet? `}
        <Link href='/sign-up' className='underline'>
          Create an account
        </Link>
      </div>
    </form>
  )
}
