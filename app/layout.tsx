import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Session } from "next-auth"

import { Providers } from "@/src/misc/providers"
import { Toaster } from "@/src/ui-lib/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })
export const metadata: Metadata = {
  title: "MPP",
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: {
    session: Session
  }
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers params={params}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
