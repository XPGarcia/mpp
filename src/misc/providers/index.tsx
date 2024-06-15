"use client"

import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

interface Props {
  children: React.ReactNode
  params: {
    session: Session
  }
}

export const Providers = ({ children, params }: Props) => {
  return <SessionProvider session={params.session}>{children}</SessionProvider>
}
