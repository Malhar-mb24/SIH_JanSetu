'use client'

import { ReactNode } from 'react'

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
