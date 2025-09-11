import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Work | JanSetu Admin',
  description: 'Manage your assigned tasks and track their progress',
}

export default function MyWorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {children}
      </div>
    </div>
  )
}
