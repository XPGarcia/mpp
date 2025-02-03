"use client"

import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

import { TRPCProvider } from "@/src/utils/_trpc/provider"

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
