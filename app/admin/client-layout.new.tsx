'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Sun, Moon } from 'lucide-react'

function AdminLayout({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  const { user } = useAuth()

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dark mode toggle */}
      <div className="flex justify-end p-4">
        <button
          type="button"
          className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          onClick={() => setDarkMode(!darkMode)}
        >
          <span className="sr-only">Toggle dark mode</span>
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}

export function AdminClientLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
