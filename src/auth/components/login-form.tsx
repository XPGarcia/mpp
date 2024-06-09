"use client"

import { FormInput, Button } from "@/src/misc"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
})

type LoginFormData = z.infer<typeof schema>

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schema),
  })

  const submit = (formData: LoginFormData) => {
    console.log(formData)
  }

  return (
    <form
      className='flex flex-col gap-y-4 py-5'
      onSubmit={handleSubmit(submit)}
    >
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
      <Button type='submit' className='mt-2'>
        Login
      </Button>
    </form>
  )
}
