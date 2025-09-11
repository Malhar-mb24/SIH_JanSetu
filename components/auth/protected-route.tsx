"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "./login-form"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string | string[]
  fallback?: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  fallback, 
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    hasPermission,
    hasAllPermissions
  } = useAuth()
  const router = useRouter()

  // Check if user has the required role
  const hasRequiredRole = !allowedRoles.length || 
    (user?.role && allowedRoles.includes(user.role))

  // Check if user has the required permissions
  const hasRequiredPermissions = !requiredPermission || 
    (Array.isArray(requiredPermission) 
      ? hasAllPermissions(requiredPermission)
      : hasPermission(requiredPermission))

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    // Store the current URL to redirect back after login
    if (typeof window !== 'undefined') {
      const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/login?callbackUrl=${callbackUrl}`)
    }
    return <LoginForm />
  }

  // Handle unauthorized access (wrong role or missing permissions)
  if (!hasRequiredRole || !hasRequiredPermissions) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-gray-600">
              {!hasRequiredRole 
                ? "You don't have the required role to access this page."
                : "You don't have permission to view this content."}
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
