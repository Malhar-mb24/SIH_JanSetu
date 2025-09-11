"use client"

import { usePathname } from "next/navigation"
import { TopNavigation } from "./top-navigation"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login' || pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && <TopNavigation />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
