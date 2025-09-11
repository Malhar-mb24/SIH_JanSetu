"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { AlertCircle, Loader2, Shield } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Handle error from URL query params (e.g., from middleware)
  useEffect(() => {
    const errorMessage = searchParams.get('error')
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage))
      // Clear the error from URL
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('error')
      router.replace(`${window.location.pathname}?${newSearchParams.toString()}`)
    }
  }, [searchParams, router])

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      const searchParams = new URLSearchParams(window.location.search)
      const callbackUrl = searchParams.get('callbackUrl')
      router.push(callbackUrl || '/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }
    
    setIsSubmitting(true)

    try {
      const success = await login(email, password)
      if (!success) {
        setError("Invalid email or password. Please try again.")
      }
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(`Login failed: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Jharkhand Municipal Corporation</CardTitle>
          <CardDescription>Digital Governance Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@jharkhandmc.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting || isAuthLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting || isAuthLoading}
              />
            </div>

            {error && (
              <Alert 
                variant="destructive" 
                className="animate-fade-in transition-opacity duration-200"
                role="alert"
                aria-live="assertive"
              >
                <AlertDescription className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || isAuthLoading}
              aria-busy={isSubmitting || isAuthLoading}
            >
              {(isSubmitting || isAuthLoading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSubmitting ? 'Signing in...' : 'Checking session...'}
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>
                <strong>Admin:</strong> admin@jharkhandmc.gov.in / demo123
              </p>
              <p>
                <strong>Manager:</strong> manager@jharkhandmc.gov.in / demo123
              </p>
              <p>
                <strong>Staff:</strong> staff@jharkhandmc.gov.in / demo123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
