import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/src/misc/providers"
import { Session } from "next-auth"
import { Toaster } from "react-hot-toast"
import { BottomNavigation } from "@/src/misc/components/bottom-navigation/bottom-navigation"

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
        <Providers params={params}>
          <div>
            <div className='flex w-full justify-center p-4 pb-[84px]'>
              <div className='w-full max-w-slim'>{children}</div>
            </div>
            <BottomNavigation />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
