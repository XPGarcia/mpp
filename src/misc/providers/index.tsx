"use client"

import { TRPCProvider } from "@/src/utils/_trpc/provider"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

interface Props {
  children: React.ReactNode
  params: {
    session: Session
  }
}

export const Providers = ({ children, params }: Props) => {
  return (
    <SessionProvider session={params.session}>
      <TRPCProvider>{children}</TRPCProvider>
    </SessionProvider>
  )
}
