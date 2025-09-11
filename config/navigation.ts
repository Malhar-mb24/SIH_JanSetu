import { Home, FileText, MapPin, Users, BarChart2, UserCog } from "lucide-react"

export interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["super_admin", "admin", "manager", "commissioner", "staff"]
  },
  {
    title: "My Work",
    href: "/my-work",
    icon: FileText,
    roles: ["staff"]
  },
  {
    title: "Command Center",
    href: "/command-center",
    icon: MapPin,
    roles: ["super_admin", "admin", "manager", "commissioner"]
  },
  {
    title: "Staff Management",
    href: "/staff",
    icon: Users,
    roles: ["super_admin", "admin", "manager"]
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart2,
    roles: ["super_admin", "admin", "commissioner"]
  },
  {
    title: "Admin",
    href: "/admin",
    icon: UserCog,
    roles: ["super_admin", "admin"]
  }
]
