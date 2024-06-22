import { BottomNavigation } from "@/src/misc/components/bottom-navigation/bottom-navigation"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <div className='flex w-full justify-center p-4 pb-[92px]'>
        <div className='w-full max-w-slim'>{children}</div>
      </div>
      <BottomNavigation />
    </div>
  )
}
