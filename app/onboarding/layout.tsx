export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <div className='flex min-h-screen w-full items-center justify-center px-4 py-6'>
        <div className='w-full max-w-slim'>{children}</div>
      </div>
    </div>
  )
}
