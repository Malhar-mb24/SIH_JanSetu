"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CommonButton } from "@/components/ui/common-button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useULB } from "@/contexts/ulb-context"
import { 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Settings, 
  ChevronDown, 
  Home, 
  MapPin, 
  Users as UsersIcon, 
  BarChart2, 
  UserCog, 
  FileText 
} from "lucide-react"
import { ULBSelector } from "@/components/common/ulb-selector"
import { navigationItems } from "@/config/navigation"
import type { NavigationItem } from "@/config/navigation"

export function TopNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { isSuperAdmin } = useULB()

  const handleLogout = async () => {
    try {
      // Close all menus first
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      setShowLogoutConfirm(false);
      
      // Call the logout function which will handle the redirect
      await logout();
      
      // This code will only run if the redirect in logout() fails
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
      // Still try to redirect to login even if there was an error
      window.location.href = '/login';
    }
  }
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isProfileOpen && !target.closest('.profile-dropdown')) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  if (!user) return null

  // Navigation items
  const navItems = navigationItems.filter(item => {
    // Debug logging
    console.log('User role:', user.role, 'Checking item:', item.title, 'Allowed roles:', item.roles)
    const hasAccess = item.roles.includes(user.role)
    console.log('Has access:', hasAccess)
    return hasAccess
  })

  return (
    <div className="bg-blue-600 text-white shadow-md">
      {/* Top Header */}
      <div className="bg-blue-700 px-4 py-1">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xs">Jharkhand Government</div>
          <div className="text-xs">राज्य सरकार | State Government</div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold">Jharkhand Civic Response</h1>
                <p className="text-xs opacity-90">Municipal Management System</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link key={item.href} href={item.href}>
                    <CommonButton
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "px-3 py-2 text-sm font-medium",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "text-white/90 hover:bg-white/10"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </CommonButton>
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center space-x-2 border-l border-white/20 pl-4">
              {/* ULB Selector */}
              <ULBSelector />
              
              {/* User Profile Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-medium">{user?.name || 'User'}</div>
                    <div className="text-xs opacity-80 capitalize">{user?.role?.replace('_', ' ') || 'staff'}</div>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault()
                          setIsProfileOpen(false)
                          setIsMobileMenuOpen(false)
                          window.location.href = '/profile' // Force full page load
                        }}
                      >
                        <User className="mr-3 h-5 w-5 text-gray-400" />
                        My Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault()
                          setIsProfileOpen(false)
                          setIsMobileMenuOpen(false)
                          window.location.href = '/settings' // Force full page load
                        }}
                      >
                        <Settings className="mr-3 h-5 w-5 text-gray-400" />
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        role="menuitem"
                      >
                        <LogOut className="mr-3 h-5 w-5 text-red-400" />
                        Sign out
                      </button>
                      
                      {/* Logout Confirmation Dialog */}
                      {showLogoutConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowLogoutConfirm(false)
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleLogout()
                                  setShowLogoutConfirm(false)
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                              >
                                Logout
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    isActive 
                      ? 'bg-blue-800 text-white' 
                      : 'text-white hover:bg-blue-600',
                    'group flex items-center px-3 py-2 text-base font-medium rounded-md'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className={cn(
                    isActive ? 'text-white' : 'text-blue-300 group-hover:text-white',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )} />
                  {item.title}
                </Link>
              )
            })}
            
            <div className="pt-4 pb-3 border-t border-blue-800">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-sm font-medium text-blue-200">
                    {user?.role || 'staff'}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <ULBSelector />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowLogoutConfirm(true)
                  }}
                  className="block w-full px-4 py-2 text-base font-medium text-red-400 hover:bg-red-900/20 rounded-md flex items-center"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
