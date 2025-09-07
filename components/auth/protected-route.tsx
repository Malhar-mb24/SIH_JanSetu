"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { hasPermission } from "@/lib/auth"
import { LoginForm } from "./login-form"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string | string[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, requiredPermission, fallback }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  const hasRequiredPermissions = requiredPermission 
    ? Array.isArray(requiredPermission)
      ? requiredPermission.every(permission => hasPermission(user, permission))
      : hasPermission(user, requiredPermission)
    : true;

  if (requiredPermission && !hasRequiredPermissions) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this resource.</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
