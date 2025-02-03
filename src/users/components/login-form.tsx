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
import { AppRoutes } from "@/src/utils/routes"

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof schema>

export const LoginForm = () => {
  const { toast } = useToast()

  const form = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schema),
  })
  const router = useRouter()

  const submit = async (formData: LoginFormData) => {
    const response = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })
    if (!response || response?.error) {
      toast({ description: response?.error || "An error occurred", variant: "destructive" })
    } else {
      toast({ description: "Logged in successfully" })
      router.replace(AppRoutes.landing)
    }
  }

  return (
    <Form {...form}>
      <form className='flex flex-col gap-y-4 py-5' onSubmit={form.handleSubmit(submit)}>
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
        <Button type='submit' className='mt-1' isLoading={form.formState.isSubmitting}>
          Login
        </Button>
        <div className='text-center text-xs text-neutral-500'>
          {`Don't have an account yet? `}
          <Link href='/sign-up' className='underline'>
            Create an account
          </Link>
        </div>
      </form>
    </Form>
  )
}
