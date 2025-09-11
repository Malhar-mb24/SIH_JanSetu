/**
 * Authentication and Role-Based Access Control (RBAC) System
 *
 * This module provides mock authentication functionality for the Jharkhand Municipal Corporation Dashboard.
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Replace mock functions with actual authentication service (e.g., NextAuth.js, Supabase Auth, etc.)
 * - Implement secure session management with JWT tokens or server-side sessions
 * - Add password hashing and validation
 * - Implement proper user registration and password reset flows
 * - Add audit logging for authentication events
 * - Consider implementing 2FA for admin accounts
 * - Integrate with Jharkhand government SSO systems
 * - Add integration with Aadhaar authentication for citizen services
 */

export type UserRole = "super_admin" | "admin" | "manager" | "staff" | "commissioner"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department?: string
  avatar?: string
  permissions: string[]
  lastLogin?: Date
  isActive: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock user data - Replace with actual database queries
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "superadmin@jharkhandmc.gov.in",
    name: "Super Administrator",
    role: "super_admin",
    department: "Administration",
    permissions: ["*"],
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "2",
    email: "admin@jharkhandmc.gov.in",
    name: "Municipal Administrator",
    role: "admin",
    department: "Administration",
    permissions: ["*"],
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "3",
    email: "manager@jharkhandmc.gov.in",
    name: "Department Manager",
    role: "manager",
    department: "Operations",
    permissions: [
      "view_issues", 
      "manage_issues", 
      "view_staff",
      "dashboard.view",
      "reports.view",
      "staff.manage"
    ],
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "4",
    email: "staff@jharkhandmc.gov.in",
    name: "Field Staff",
    role: "staff",
    department: "Field Operations",
    permissions: [
      "view_issues", 
      "update_issues",
      "view_profile",
      "dashboard.view"
    ],
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "5",
    email: "commissioner@jharkhandmc.gov.in",
    name: "Municipal Commissioner",
    role: "commissioner",
    department: "Commissioner Office",
    permissions: ["view_analytics", "view_reports", "manage_issues"],
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "6",
    email: "manager@jharkhandmc.gov.in",
    name: "Department Manager",
    role: "manager",
    department: "Public Works",
    permissions: ["dashboard.view", "issues.manage", "community.moderate", "reports.view"],
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "3",
    email: "staff@jharkhandmc.gov.in",
    name: "Field Agent",
    role: "staff",
    department: "Field Operations",
    permissions: ["dashboard.view", "issues.update", "community.view"],
    lastLogin: new Date(),
    isActive: true,
  },
]

/**
 * Mock authentication function
 *
 * BACKEND TODO:
 * - Implement actual credential validation
 * - Add rate limiting for login attempts
 * - Hash and compare passwords securely
 * - Generate secure session tokens
 * - Log authentication attempts
 * - Integrate with Jharkhand government authentication systems
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock authentication - Replace with actual validation
  const user = MOCK_USERS.find((u) => u.email === email && u.isActive)

  if (user && password === "demo123") {
    // Mock password check
    return user
  }

  return null
}

/**
 * Get current user session
 *
 * BACKEND TODO:
 * - Validate session token from cookies/headers
 * - Check token expiration
 * - Refresh tokens if needed
 * - Handle session cleanup
 * - Integrate with Jharkhand government session management
 */
export async function getCurrentUser(): Promise<User | null> {
  // Mock session check - Replace with actual session validation
  const storedUser = localStorage.getItem("jharkhand_mc_user")
  if (storedUser) {
    return JSON.parse(storedUser)
  }
  return null
}

/**
 * Logout user and cleanup session
 *
 * BACKEND TODO:
 * - Invalidate server-side session
 * - Clear authentication cookies
 * - Log logout event
 * - Cleanup any cached data
 */
export async function logoutUser(): Promise<void> {
  try {
    // In a real implementation, this would make an API call to invalidate the session
    console.log('Logging out user...');
    
    // Clear any client-side auth state
    if (typeof window !== 'undefined') {
      // Clear all auth-related items from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Clear auth cookies
      document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Clear session storage if used
      sessionStorage.clear();
      
      // Clear any service worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Force a hard reload to ensure all state is cleared
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error during logout:', error)
    // Still try to redirect to login even if there was an error
    window.location.href = '/login'
    throw error // Re-throw to allow error handling in the calling function
  }
}

/**
 * Check if user has specific permission
 *
 * BACKEND TODO:
 * - Implement granular permission checking
 * - Add role hierarchy validation
 * - Cache permissions for performance
 * - Add permission inheritance logic
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.isActive) return false

  // Admin has all permissions
  if (user.permissions.includes("*")) return true

  // Check specific permission
  return user.permissions.includes(permission)
}

/**
 * Get permissions for user role
 */
export function getRolePermissions(role: UserRole): string[] {
  const rolePermissions: Record<UserRole, string[]> = {
    super_admin: ["*"],
    admin: ["*"],
    manager: ["dashboard.view", "issues.manage", "community.moderate", "reports.view", "staff.view"],
    staff: ["dashboard.view", "issues.view", "issues.update", "community.view"],
    commissioner: ["dashboard.view", "analytics.view", "reports.view", "issues.view"]
  }

  return rolePermissions[role] || []
}
