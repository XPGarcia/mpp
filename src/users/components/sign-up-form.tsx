"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/src/ui-lib/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/ui-lib/components/ui/form"
import { Input } from "@/src/ui-lib/components/ui/input"
import { useToast } from "@/src/ui-lib/hooks/use-toast"
import { trpc } from "@/src/utils/_trpc/client"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { AppRoutes } from "@/src/utils/routes"

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
  const { toast } = useToast()

  const form = useForm<SignUpFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schema),
  })

  const router = useRouter()

  const { mutateAsync: registerUser } = trpc.users.register.useMutation()

  const submit = async (formData: SignUpFormData) => {
    try {
      await registerUser(formData)
      const response = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      if (!response || response?.error) {
        toast({
          description: response?.error || "Failed to log in automatically. Please log in manually.",
          variant: "destructive",
        })
        router.replace(AppRoutes.login)
      } else {
        toast({ description: "Account created successfully" })
        router.replace(AppRoutes.verifyEmail)
      }
    } catch (error) {
      const message = getErrorMessage(error)
      toast({ description: message, variant: "destructive" })
    }
  }

  return (
    <Form {...form}>
      <form className='flex flex-col gap-y-4 py-5' onSubmit={form.handleSubmit(submit)}>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='First Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Last Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Confirm Password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='mt-1' isLoading={form.formState.isSubmitting}>
          Sign Up
        </Button>
        <div className='text-center text-xs text-neutral-500'>
          {`Do you have an account yet? `}
          <Link href={AppRoutes.login} className='underline'>
            Log in
          </Link>
          {` into your account`}
        </div>
      </form>
    </Form>
  )
}
