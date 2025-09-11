'use client'

import { ReactNode } from 'react'
import { ULBProvider } from '@/contexts/ulb-context'

export function CommandCenterClientLayout({ children }: { children: ReactNode }) {
  return (
    <ULBProvider>
      <div className="flex h-screen flex-col">
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </ULBProvider>
  )
}
