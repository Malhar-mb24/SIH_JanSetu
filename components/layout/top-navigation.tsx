"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CommonButton } from "@/components/ui/common-button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { BarChart3, FileText, Users, MapPin, Bell, Settings, LogOut, Menu, X } from "lucide-react"
import { TranslationButton } from "@/components/common/translation-button"

/**
 * BACKEND INTEGRATION NOTES:
 * - Replace mock navigation items with role-based menu from API
 * - Add real-time notification count from WebSocket/SSE
 * - Implement proper logout with session cleanup
 * - Add user preferences for navigation state persistence
 * - Integrate with Jharkhand government SSO systems
 * - Add Jharkhand-specific modules and plugins
 * - Connect to state portal APIs and Digital India services
 */

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    roles: ["admin", "manager", "staff"],
  },
  {
    title: "Issues",
    href: "/issues",
    icon: FileText,
    roles: ["admin", "manager", "staff"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["admin", "manager"],
  },
  {
    title: "Community",
    href: "/community",
    icon: Users,
    roles: ["admin", "manager"],
  },
]

export function TopNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Filter navigation based on user role
  const allowedItems = navigationItems.filter((item) => item.roles.includes(user?.role || "staff"))

  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg">
      {/* Jharkhand Government Header */}
      <div className="bg-orange-600 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold">Government of Jharkhand</span>
            </div>
            <div className="hidden md:block text-sm opacity-90">राज्य सरकार | State Government</div>
          </div>
          <div className="text-sm opacity-90">Digital India Initiative</div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Jharkhand Civic Response Platform</h1>
                <p className="text-sm opacity-90">Municipal Corporation Management System</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-1">
              {allowedItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <CommonButton
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        isActive ? "bg-white/20 text-white font-semibold" : "text-white hover:bg-white/10"
                      )}
                      icon={<Icon className="h-4 w-4" />}
                    >
                      {item.title}
                    </CommonButton>
                  </Link>
                )
              })}
            </nav>

            {/* Translation Button */}
            <div className="flex items-center">
              <TranslationButton />
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-3 border-l border-white/20 pl-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">{user?.name?.charAt(0) || "U"}</span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <Badge variant="outline" className="text-xs border-white/30 text-white">
                    {user?.role || "staff"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <CommonButton variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Bell className="h-4 w-4" />
                </CommonButton>
                <CommonButton variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Settings className="h-4 w-4" />
                </CommonButton>
                <CommonButton variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
                  <LogOut className="h-4 w-4" />
                </CommonButton>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <CommonButton
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/10"
              icon={isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4">
            <nav className="space-y-2">
              {allowedItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <CommonButton
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive ? "bg-white/20 font-semibold" : "text-white hover:bg-white/10"
                      )}
                      icon={<Icon className="h-4 w-4" />}
                    >
                      {item.title}
                    </CommonButton>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile User Section */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium">{user?.name?.charAt(0) || "U"}</span>
                </div>
                <div>
                  <p className="font-medium">{user?.name || "User"}</p>
                  <Badge variant="outline" className="text-xs border-white/30 text-white">
                    {user?.role || "staff"}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <CommonButton variant="ghost" size="sm" className="flex-1 text-white hover:bg-white/10" icon={<Bell className="h-4 w-4" />}>
                  Notifications
                </CommonButton>
                <CommonButton variant="ghost" size="sm" className="flex-1 text-white hover:bg-white/10" icon={<Settings className="h-4 w-4" />}>
                  Settings
                </CommonButton>
                <CommonButton variant="ghost" size="sm" onClick={logout} className="flex-1 text-white hover:bg-white/10" icon={<LogOut className="h-4 w-4" />}>
                  Logout
                </CommonButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
