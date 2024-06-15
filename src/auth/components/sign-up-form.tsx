"use client"

import { RegisterOutput } from "@/app/api/register/route"
import { FormInput, Button } from "@/src/misc"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { HttpClient } from "@/src/utils/http-client/http-client"
import { ApiRoutes } from "@/src/utils/routes"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    () => {
      return { message: "Passwords do not match", path: ["confirmPassword"] }
    }
  )

type SignUpFormData = z.infer<typeof schema>

export const SignUpForm = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schema),
  })

  const router = useRouter()

  const submit = async (formData: SignUpFormData) => {
    try {
      const { error } = await HttpClient.post<RegisterOutput>(ApiRoutes.register, formData)
      if (error) {
        throw new Error(error)
      }
      toast.success("Account created successfully")
      router.push("/login")
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(message)
    }
  }

  return (
    <form className='flex flex-col gap-y-4 py-5' onSubmit={handleSubmit(submit)}>
      <div className='grid grid-cols-2 gap-4'>
        <FormInput
          label='First Name'
          type='text'
          placeholder='First Name'
          errorMessage={errors.firstName?.message}
          {...register("firstName")}
        />
        <FormInput
          label='Last Name'
          type='text'
          placeholder='Last Name'
          errorMessage={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>
      <FormInput
        label='Email'
        type='email'
        placeholder='Email'
        errorMessage={errors.email?.message}
        {...register("email")}
      />
      <FormInput
        label='Password'
        type='password'
        placeholder='Password'
        errorMessage={errors.password?.message}
        helperText='Your password must be at least 12 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        {...register("password")}
      />
      <FormInput
        label='Confirm Password'
        type='password'
        placeholder='Confirm Password'
        errorMessage={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type='submit' className='mt-1' isLoading={isSubmitting}>
        Sign Up
      </Button>
      <div className='text-center text-xs text-neutral-500'>
        {`Do you have an account yet? `}
        <Link href='/login' className='underline'>
          Log in
        </Link>
        {` into your account`}
      </div>
    </form>
  )
}
