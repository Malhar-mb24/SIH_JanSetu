"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser, getCurrentUser, logoutUser, type User, type UserRole } from '@/lib/auth';

// Default routes for each role
const DEFAULT_ROUTES: Record<UserRole, string> = {
  super_admin: '/admin/dashboard',
  admin: '/dashboard',
  manager: '/manager/dashboard',
  staff: '/my-work',
  commissioner: '/reports'
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  getRedirectPath: (role?: UserRole) => string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const getRedirectPath = useCallback((role: UserRole = 'staff'): string => {
    if (typeof window === 'undefined') return '/dashboard';
    
    const searchParams = new URLSearchParams(window.location.search);
    const callbackUrl = searchParams.get('callbackUrl');
    
    if (callbackUrl && !callbackUrl.startsWith('/login')) {
      return callbackUrl;
    }
    
    return DEFAULT_ROUTES[role] || '/dashboard';
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await authenticateUser(email, password);
      if (user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
      }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear auth state first to prevent race conditions
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Call the logout API
      await logoutUser();
      
      // Clear any remaining auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        sessionStorage.clear();
      }
      
      // Force a full page reload to ensure all state is cleared
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
        // Prevent any further code execution after redirect
        await new Promise(() => {});
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, we still want to redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw error; // Re-throw to allow error handling in components if needed
    }
  };

  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return roles.some(role => state.user?.role === role);
  }, [state.user]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user?.permissions) return false;
    return state.user.permissions.includes(permission);
  }, [state.user?.permissions]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    if (!state.user?.permissions) return false;
    return permissions.every(permission => 
      state.user?.permissions?.includes(permission)
    );
  }, [state.user?.permissions]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login,
        logout,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAllPermissions,
        getRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
