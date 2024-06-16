"use client"

import { Button } from "@/src/misc"
import { signOut } from "next-auth/react"
import { MouseEvent } from "react"

export default function Home() {
  const logout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await signOut()
  }

  return (
    <main className='flex w-full items-center justify-center p-4'>
      <Button onClick={logout}>Logout</Button>
    </main>
  )
}
