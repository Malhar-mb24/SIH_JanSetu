/**
 * Mock Data for Jansetu Municipal Dashboard
 *
 * This module provides mock data for all dashboard components.
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Replace with actual API calls to municipal databases
 * - Implement real-time data fetching with WebSocket connections
 * - Add data validation and sanitization
 * - Implement caching strategies for performance
 * - Add error handling and retry logic
 * - Consider implementing data pagination for large datasets
 */

export interface Issue {
  id: string
  title: string
  description: string
  category: "infrastructure" | "sanitation" | "utilities" | "safety" | "environment"
  priority: "low" | "medium" | "high" | "critical"
  status: "open" | "in-progress" | "resolved" | "closed"
  location: {
    lat: number
    lng: number
    address: string
  }
  reportedBy: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  images?: string[]
  timeline?: TimelineEntry[]
  resolutionDetails?: ResolutionDetails
}

export interface KPIData {
  totalIssues: number
  resolvedIssues: number
  pendingIssues: number
  criticalIssues: number
  avgResolutionTime: number // in hours
  citizenSatisfaction: number // percentage
}

export interface CommunityEvent {
  id: string
  title: string
  description: string
  date: Date
  location: string
  attendees: number
  maxAttendees: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  organizer: string
}

export interface TimelineEntry {
  id: string
  type: "status_change" | "comment" | "assignment" | "image_upload" | "resolution"
  timestamp: Date
  user: string
  userRole: "citizen" | "staff" | "admin"
  content: string
  metadata?: {
    oldValue?: string
    newValue?: string
    images?: string[]
  }
}

export interface ResolutionDetails {
  resolvedAt: Date
  resolvedBy: string
  resolutionNotes: string
  resolutionImages?: string[]
  citizenFeedback?: {
    rating: number
    comment: string
    submittedAt: Date
  }
}

// Mock Issues Data
export const MOCK_ISSUES: Issue[] = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues near the city center",
    category: "infrastructure",
    priority: "high",
    status: "in-progress",
    location: {
      lat: 28.6139,
      lng: 77.209,
      address: "Main Street, Block A, New Delhi",
    },
    reportedBy: "citizen@example.com",
    assignedTo: "Public Works Team",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16"),
    images: ["/pothole-on-main-street.jpg"],
    timeline: [
      {
        id: "t1",
        type: "status_change",
        timestamp: new Date("2024-01-15T09:00:00"),
        user: "citizen@example.com",
        userRole: "citizen",
        content: "Issue reported",
        metadata: { newValue: "open" },
      },
      {
        id: "t2",
        type: "assignment",
        timestamp: new Date("2024-01-15T14:30:00"),
        user: "admin@municipal.gov",
        userRole: "admin",
        content: "Assigned to Public Works Team",
        metadata: { newValue: "Public Works Team" },
      },
      {
        id: "t3",
        type: "status_change",
        timestamp: new Date("2024-01-16T08:00:00"),
        user: "staff@publicworks.gov",
        userRole: "staff",
        content: "Work started on pothole repair",
        metadata: { oldValue: "open", newValue: "in-progress" },
      },
    ],
  },
  {
    id: "2",
    title: "Broken Street Light",
    description: "Street light not working, creating safety concerns",
    category: "utilities",
    priority: "medium",
    status: "open",
    location: {
      lat: 28.6129,
      lng: 77.2295,
      address: "Park Avenue, Sector 12",
    },
    reportedBy: "resident@example.com",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    images: ["/broken-street-light-at-night.jpg"],
    timeline: [
      {
        id: "t4",
        type: "status_change",
        timestamp: new Date("2024-01-14T20:15:00"),
        user: "resident@example.com",
        userRole: "citizen",
        content: "Street light reported as non-functional",
        metadata: { newValue: "open" },
      },
    ],
  },
  {
    id: "3",
    title: "Garbage Collection Missed",
    description: "Garbage not collected for 3 days in residential area",
    category: "sanitation",
    priority: "critical",
    status: "open",
    location: {
      lat: 28.6169,
      lng: 77.209,
      address: "Green Park Extension",
    },
    reportedBy: "community@example.com",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
    images: ["/overflowing-garbage-bins.jpg", "/street-with-accumulated-waste.jpg"],
    timeline: [
      {
        id: "t5",
        type: "status_change",
        timestamp: new Date("2024-01-13T07:30:00"),
        user: "community@example.com",
        userRole: "citizen",
        content: "Garbage collection issue reported",
        metadata: { newValue: "open" },
      },
    ],
  },
  {
    id: "4",
    title: "Water Leakage",
    description: "Major water pipe leakage causing road flooding",
    category: "utilities",
    priority: "critical",
    status: "resolved",
    location: {
      lat: 28.6189,
      lng: 77.219,
      address: "Central Avenue, Block C",
    },
    reportedBy: "alert@example.com",
    assignedTo: "Water Department",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-15"),
    images: ["/water-pipe-leakage-flooding-street.jpg"],
    timeline: [
      {
        id: "t6",
        type: "status_change",
        timestamp: new Date("2024-01-12T06:00:00"),
        user: "alert@example.com",
        userRole: "citizen",
        content: "Water leakage emergency reported",
        metadata: { newValue: "open" },
      },
      {
        id: "t7",
        type: "assignment",
        timestamp: new Date("2024-01-12T06:15:00"),
        user: "emergency@municipal.gov",
        userRole: "admin",
        content: "Emergency assignment to Water Department",
        metadata: { newValue: "Water Department" },
      },
      {
        id: "t8",
        type: "status_change",
        timestamp: new Date("2024-01-12T08:00:00"),
        user: "water@municipal.gov",
        userRole: "staff",
        content: "Emergency crew dispatched",
        metadata: { oldValue: "open", newValue: "in-progress" },
      },
      {
        id: "t9",
        type: "resolution",
        timestamp: new Date("2024-01-15T16:00:00"),
        user: "water@municipal.gov",
        userRole: "staff",
        content: "Pipe repaired and road cleaned",
        metadata: {
          oldValue: "in-progress",
          newValue: "resolved",
          images: ["/repaired-water-pipe-and-clean-street.jpg"],
        },
      },
    ],
    resolutionDetails: {
      resolvedAt: new Date("2024-01-15T16:00:00"),
      resolvedBy: "Water Department - Team Lead John Smith",
      resolutionNotes:
        "Replaced damaged section of main water pipe. Cleaned and restored road surface. Implemented additional monitoring to prevent future issues.",
      resolutionImages: ["/repaired-water-pipe-and-clean-street.jpg"],
      citizenFeedback: {
        rating: 5,
        comment: "Excellent response time and quality of work. Thank you!",
        submittedAt: new Date("2024-01-16T10:00:00"),
      },
    },
  },
]

// Mock KPI Data
export const MOCK_KPI_DATA: KPIData = {
  totalIssues: 156,
  resolvedIssues: 89,
  pendingIssues: 67,
  criticalIssues: 12,
  avgResolutionTime: 48,
  citizenSatisfaction: 78,
}

// Mock Community Events
export const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: "1",
    title: "Community Clean-up Drive",
    description: "Join us for a neighborhood cleaning initiative",
    date: new Date("2024-01-20"),
    location: "Central Park",
    attendees: 45,
    maxAttendees: 100,
    status: "upcoming",
    organizer: "Environmental Committee",
  },
  {
    id: "2",
    title: "Town Hall Meeting",
    description: "Monthly community meeting to discuss local issues",
    date: new Date("2024-01-25"),
    location: "Municipal Hall",
    attendees: 78,
    maxAttendees: 150,
    status: "upcoming",
    organizer: "Municipal Office",
  },
]

/**
 * API Functions - Replace with actual backend calls
 */

export async function fetchIssues(): Promise<Issue[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_ISSUES
}

export async function fetchKPIData(): Promise<KPIData> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_KPI_DATA
}

export async function fetchCommunityEvents(): Promise<CommunityEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return MOCK_EVENTS
}

export function getPriorityColor(priority: Issue["priority"]): string {
  const colors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }
  return colors[priority]
}

export function getStatusColor(status: Issue["status"]): string {
  const colors = {
    open: "bg-gray-100 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-600",
  }
  return colors[status]
}

export function getCategoryIcon(category: Issue["category"]): string {
  const icons = {
    infrastructure: "🏗️",
    sanitation: "🧹",
    utilities: "⚡",
    safety: "🛡️",
    environment: "🌱",
  }
  return icons[category]
}
