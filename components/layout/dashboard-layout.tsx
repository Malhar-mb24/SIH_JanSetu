"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { TopNavigation } from "./top-navigation"
import { redirect } from "next/navigation"
import ChatbotWidget from "@/components/chatbot/chatbot-widget"

/**
 * BACKEND INTEGRATION NOTES:
 * - Add session validation middleware
 * - Implement proper authentication checks
 * - Add loading states for auth verification
 * - Handle token refresh logic
 * - Add chatbot conversation persistence
 * - Implement role-based chatbot features
 */

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavigation />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      <ChatbotWidget />
    </div>
  )
}
