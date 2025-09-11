'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'

type UserRole = 'super_admin' | 'commissioner' | 'manager' | 'staff'

interface ULB {
  id: string
  name: string
  code: string
  district: string
  state: string
  type: 'Municipal Corporation' | 'Municipality' | 'Nagar Panchayat'
}

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  ulbId: string | null // null for super_admin
  department?: string
  permissions: string[]
}

interface ULBContextType {
  currentULB: ULB | null
  setCurrentULB: (ulb: ULB | null) => void
  availableULBs: ULB[]
  user: User | null
  isLoading: boolean
  isSuperAdmin: boolean
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
}

const ULBContext = createContext<ULBContextType | undefined>(undefined)

// Mock data - List of ULBs in Jharkhand
const MOCK_ULBS: ULB[] = [
  {
    id: 'ulb_adi',
    name: 'ADITYAPUR MUNICIPAL CORPORATION',
    code: 'ADI',
    district: 'Seraikela Kharsawan',
    state: 'Jharkhand',
    type: 'Municipal Corporation'
  },
  {
    id: 'ulb_bar',
    name: 'BARHARWA NAGAR PANCHAYAT',
    code: 'BAR',
    district: 'Sahibganj',
    state: 'Jharkhand',
    type: 'Nagar Panchayat'
  },
  {
    id: 'ulb_bas',
    name: 'BARKI SARAI NAGAR PANCHAYAT',
    code: 'BAS',
    district: 'Jamui',
    state: 'Jharkhand',
    type: 'Nagar Panchayat'
  },
  {
    id: 'ulb_bis',
    name: 'BISHARAMPUR NAGAR PARISHAD',
    code: 'BIS',
    district: 'Hazaribagh',
    state: 'Jharkhand',
    type: 'Municipality'
  },
  {
    id: 'ulb_bun',
    name: 'BUNDU NAGAR PANCHAYAT',
    code: 'BUN',
    district: 'Ranchi',
    state: 'Jharkhand',
    type: 'Nagar Panchayat'
  },
  {
    id: 'ulb_cha',
    name: 'CHAKRADHARPUR NAGAR PARISHAD',
    code: 'CHA',
    district: 'West Singhbhum',
    state: 'Jharkhand',
    type: 'Municipality'
  },
  {
    id: 'ulb_chi',
    name: 'CHIRKUNDA NAGAR PARISHAD',
    code: 'CHI',
    district: 'Dhanbad',
    state: 'Jharkhand',
    type: 'Municipality'
  },
  {
    id: 'ulb_deo',
    name: 'DEOGHAR MUNICIPAL CORPORATION',
    code: 'DEO',
    district: 'Deoghar',
    state: 'Jharkhand',
    type: 'Municipal Corporation'
  },
  {
    id: 'ulb_dha',
    name: 'DHANBAD MUNICIPAL CORPORATION',
    code: 'DHA',
    district: 'Dhanbad',
    state: 'Jharkhand',
    type: 'Municipal Corporation'
  },
  {
    id: 'ulb_dum',
    name: 'DUMKA NAGAR PARISHAD',
    code: 'DUM',
    district: 'Dumka',
    state: 'Jharkhand',
    type: 'Municipality'
  },
  {
    id: 'ulb_gar',
    name: 'GARHWA NAGAR PARISHAD',
    code: 'GAR',
    district: 'Garhwa',
    state: 'Jharkhand',
    type: 'Municipality'
  },
  {
    id: 'ulb_gir',
    name: 'GIRIDIH NAGAR NIGAM',
    code: 'GIR',
    district: 'Giridih',
    state: 'Jharkhand',
    type: 'Municipal Corporation'
  },
  {
    id: 'ulb_god',
    name: 'GODDA NAGAR PARISHAD',
    code: 'GOD',
    district: 'Godda',
    state: 'Jharkhand',
    type: 'Municipality'
  },
  {
    id: 'ulb_gum',
    name: 'GUMLA NAGAR PARISHAD',
    code: 'GUM',
    district: 'Gumla',
    state: 'Jharkhand',
    type: 'Municipality'
  },
  {
    id: 'ulb_haz',
    name: 'HAZARIBAGH NAGAR NIGAM',
    code: 'HAZ',
    district: 'Hazaribagh',
    state: 'Jharkhand',
    type: 'Municipal Corporation'
  },
  {
    id: 'ulb_jam',
    name: 'JAMSHEDPUR NOTIFIED AREA COMMITTEE',
    code: 'JAM',
    district: 'East Singhbhum',
    state: 'Jharkhand',
    type: 'Municipal Corporation'
  },
  {
    id: 'ulb_jhu',
    name: 'JHUMRITILAIYA NAGAR PARISHAD',
    code: 'JHU',
    district: 'Koderma',
    state: 'Jharkhand',
    type: 'Municipality'
  },
  {
    id: 'ulb_med',
    name: 'MEDININAGAR NAGAR NIGAM',
    code: 'MED',
    district: 'Palamu',
    state: 'Jharkhand',
    type: 'Municipal Corporation'
  },
  {
    id: 'ulb_ram',
    name: 'RAMGARH NAGAR PARISHAD',
    code: 'RAM',
    district: 'Ramgarh',
    state: 'Jharkhand',
    type: 'Municipality'
  },
  {
    id: 'ulb_ran',
    name: 'RANCHI MUNICIPAL CORPORATION',
    code: 'RAN',
    district: 'Ranchi',
    state: 'Jharkhand',
    type: 'Municipal Corporation'
  },
  {
    id: 'ulb_sah',
    name: 'SAHIBGANJ NAGAR PARISHAD',
    code: 'SAH',
    district: 'Sahibganj',
    state: 'Jharkhand',
    type: 'Municipality'
  },
  {
    id: 'ulb_sim',
    name: 'SIMDEGA NAGAR PARISHAD',
    code: 'SIM',
    district: 'Simdega',
    state: 'Jharkhand',
    type: 'Municipality'
  }
]

// Helper function to get ULB from localStorage
const getStoredULB = (): ULB | null => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('selectedULB')
  return stored ? JSON.parse(stored) : null
}

export function ULBProvider({ children }: { children: ReactNode }) {
  const [currentULB, setCurrentULBState] = useState<ULB | null>(null)
  const [availableULBs, setAvailableULBs] = useState<ULB[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Update localStorage when currentULB changes
  const setCurrentULB = (ulb: ULB | null) => {
    if (ulb) {
      localStorage.setItem('selectedULB', JSON.stringify(ulb))
    } else {
      localStorage.removeItem('selectedULB')
    }
    setCurrentULBState(ulb)
  }

  // In a real app, this would be fetched from the API
  useEffect(() => {
    // Simulate API call
    const loadUserData = async () => {
      try {
        // TODO: Replace with actual authentication logic
        const mockUser: User = {
          id: 'user_123',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'super_admin',
          ulbId: null,
          permissions: [
            'ulb:view',
            'ulb:manage',
            'user:view',
            'user:manage',
            'issue:view',
            'issue:manage',
            'report:view',
            'report:generate',
          ]
        }

        setUser(mockUser)
        setAvailableULBs(MOCK_ULBS)
        
        // Try to get stored ULB first
        const storedULB = getStoredULB()
        
        if (storedULB && MOCK_ULBS.some(ulb => ulb.id === storedULB.id)) {
          // Use stored ULB if it exists and is valid
          setCurrentULB(storedULB)
        } else if (mockUser.ulbId) {
          // For non-super admins, set their assigned ULB
          const userULB = MOCK_ULBS.find(ulb => ulb.id === mockUser.ulbId) || null
          setCurrentULB(userULB)
        } else if (mockUser.role === 'super_admin' && MOCK_ULBS.length > 0) {
          // For super admins, default to the first ULB
          setCurrentULB(MOCK_ULBS[0])
        }
      } catch (error) {
        console.error('Failed to load user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  const isSuperAdmin = user?.role === 'super_admin'

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes(permission) || user.permissions.includes('*')
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false
    return permissions.every(permission => hasPermission(permission))
  }

  return (
    <ULBContext.Provider
      value={{
        currentULB,
        setCurrentULB,
        availableULBs,
        user,
        isLoading,
        isSuperAdmin,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </ULBContext.Provider>
  )
}

export const useULB = (): ULBContextType => {
  const context = useContext(ULBContext)
  if (context === undefined) {
    throw new Error('useULB must be used within a ULBProvider')
  }
  return context
}
