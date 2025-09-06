"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { type AuthState, authenticateUser, getCurrentUser, logoutUser } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser()
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      })
    } catch (error) {
      console.error("Auth check failed:", error)
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await authenticateUser(email, password)
      if (user) {
        localStorage.setItem("jharkhand_mc_user", JSON.stringify(user))
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const refreshUser = async () => {
    await checkAuthStatus()
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
