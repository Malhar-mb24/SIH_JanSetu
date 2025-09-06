/**
 * Community Engagement Data for Jansetu Municipal Dashboard
 *
 * This module provides mock data for community engagement features.
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Replace with actual API calls to community management databases
 * - Implement real-time event updates and notifications
 * - Add integration with social media platforms
 * - Implement volunteer management system with background checks
 * - Add gamification scoring algorithms
 * - Consider implementing push notifications for mobile apps
 * - Add integration with calendar systems and email marketing
 */

export interface CommunityEvent {
  id: string
  title: string
  description: string
  category: "cleanup" | "meeting" | "workshop" | "emergency" | "social"
  date: Date
  endDate?: Date
  location: string
  coordinates?: { lat: number; lng: number }
  organizer: string
  organizerContact: string
  attendees: number
  maxAttendees: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  registrationRequired: boolean
  tags: string[]
  images?: string[]
  requirements?: string[]
  rewards?: number // Points for participation
}

export interface Volunteer {
  id: string
  name: string
  email: string
  phone?: string
  skills: string[]
  availability: string[]
  totalHours: number
  eventsAttended: number
  points: number
  badges: string[]
  joinDate: Date
  isActive: boolean
  preferredCategories: string[]
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  authorRole: "citizen" | "official" | "volunteer"
  category: "general" | "suggestion" | "complaint" | "announcement" | "question"
  tags: string[]
  likes: number
  replies: number
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  isResolved?: boolean
  priority: "low" | "medium" | "high"
}

export interface Reward {
  id: string
  title: string
  description: string
  pointsCost: number
  category: "discount" | "recognition" | "service" | "merchandise"
  availability: number
  claimed: number
  expiryDate?: Date
  isActive: boolean
  image?: string
}

// Mock Community Events
export const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: "1",
    title: "Community Clean-up Drive",
    description:
      "Join us for a neighborhood cleaning initiative to make our streets cleaner and greener. Bring your own gloves and we'll provide all other supplies.",
    category: "cleanup",
    date: new Date("2024-01-20T09:00:00"),
    endDate: new Date("2024-01-20T12:00:00"),
    location: "Central Park, Main Entrance",
    coordinates: { lat: 28.6139, lng: 77.209 },
    organizer: "Environmental Committee",
    organizerContact: "env@jansetu.gov",
    attendees: 45,
    maxAttendees: 100,
    status: "upcoming",
    registrationRequired: true,
    tags: ["environment", "community", "volunteer"],
    requirements: ["Comfortable clothing", "Water bottle", "Sun protection"],
    rewards: 50,
  },
  {
    id: "2",
    title: "Monthly Town Hall Meeting",
    description:
      "Monthly community meeting to discuss local issues, upcoming projects, and citizen concerns. Your voice matters!",
    category: "meeting",
    date: new Date("2024-01-25T18:00:00"),
    endDate: new Date("2024-01-25T20:00:00"),
    location: "Municipal Hall, Conference Room A",
    organizer: "Municipal Office",
    organizerContact: "townhall@jansetu.gov",
    attendees: 78,
    maxAttendees: 150,
    status: "upcoming",
    registrationRequired: false,
    tags: ["governance", "community", "discussion"],
    rewards: 25,
  },
  {
    id: "3",
    title: "Digital Literacy Workshop",
    description:
      "Learn essential digital skills including online government services, digital payments, and internet safety.",
    category: "workshop",
    date: new Date("2024-01-22T14:00:00"),
    endDate: new Date("2024-01-22T17:00:00"),
    location: "Community Center, Computer Lab",
    organizer: "Digital India Initiative",
    organizerContact: "digital@jansetu.gov",
    attendees: 23,
    maxAttendees: 30,
    status: "upcoming",
    registrationRequired: true,
    tags: ["education", "technology", "skills"],
    requirements: ["Basic reading ability", "Bring ID proof"],
    rewards: 75,
  },
  {
    id: "4",
    title: "Emergency Response Training",
    description:
      "Basic first aid and emergency response training for community volunteers. Certificate provided upon completion.",
    category: "emergency",
    date: new Date("2024-01-18T10:00:00"),
    endDate: new Date("2024-01-18T16:00:00"),
    location: "Fire Station, Training Ground",
    organizer: "Emergency Services",
    organizerContact: "emergency@jansetu.gov",
    attendees: 67,
    maxAttendees: 50,
    status: "completed",
    registrationRequired: true,
    tags: ["safety", "training", "emergency"],
    rewards: 100,
  },
]

// Mock Volunteers
export const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91-9876543210",
    skills: ["Event Organization", "Teaching", "First Aid"],
    availability: ["Weekends", "Evenings"],
    totalHours: 156,
    eventsAttended: 23,
    points: 2340,
    badges: ["Community Champion", "Environmental Hero", "Safety Expert"],
    joinDate: new Date("2023-06-15"),
    isActive: true,
    preferredCategories: ["cleanup", "workshop", "emergency"],
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91-9876543211",
    skills: ["Technical Support", "Photography", "Social Media"],
    availability: ["Weekends"],
    totalHours: 89,
    eventsAttended: 12,
    points: 1450,
    badges: ["Tech Volunteer", "Community Photographer"],
    joinDate: new Date("2023-08-20"),
    isActive: true,
    preferredCategories: ["workshop", "social"],
  },
]

// Mock Forum Posts
export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "1",
    title: "Suggestion: Install More Street Lights on Park Avenue",
    content:
      "The stretch of Park Avenue between blocks 12-15 is very dark at night. Installing additional street lights would improve safety for pedestrians and reduce crime in the area.",
    author: "Concerned Citizen",
    authorRole: "citizen",
    category: "suggestion",
    tags: ["safety", "infrastructure", "lighting"],
    likes: 23,
    replies: 8,
    createdAt: new Date("2024-01-15T14:30:00"),
    updatedAt: new Date("2024-01-16T09:15:00"),
    isPinned: false,
    priority: "medium",
  },
  {
    id: "2",
    title: "Water Supply Disruption - Block 8 Area",
    content:
      "There has been no water supply in Block 8 for the past 2 days. When can we expect this to be resolved? Many families are facing difficulties.",
    author: "Resident Association",
    authorRole: "citizen",
    category: "complaint",
    tags: ["water", "utilities", "urgent"],
    likes: 45,
    replies: 12,
    createdAt: new Date("2024-01-14T08:00:00"),
    updatedAt: new Date("2024-01-16T16:30:00"),
    isPinned: true,
    isResolved: false,
    priority: "high",
  },
  {
    id: "3",
    title: "New Waste Segregation Guidelines - Effective February 1st",
    content:
      "Starting February 1st, new waste segregation guidelines will be implemented. Please separate wet waste, dry waste, and hazardous waste. Collection schedules have been updated accordingly.",
    author: "Municipal Officer",
    authorRole: "official",
    category: "announcement",
    tags: ["waste", "guidelines", "environment"],
    likes: 67,
    replies: 15,
    createdAt: new Date("2024-01-12T10:00:00"),
    updatedAt: new Date("2024-01-12T10:00:00"),
    isPinned: true,
    priority: "medium",
  },
]

// Mock Rewards
export const MOCK_REWARDS: Reward[] = [
  {
    id: "1",
    title: "Municipal Services Discount",
    description: "10% discount on property tax and utility bills",
    pointsCost: 500,
    category: "discount",
    availability: 100,
    claimed: 23,
    expiryDate: new Date("2024-12-31"),
    isActive: true,
  },
  {
    id: "2",
    title: "Community Champion Certificate",
    description: "Official recognition certificate for outstanding community service",
    pointsCost: 1000,
    category: "recognition",
    availability: 50,
    claimed: 12,
    isActive: true,
  },
  {
    id: "3",
    title: "Free Health Checkup",
    description: "Complimentary health checkup at municipal health center",
    pointsCost: 750,
    category: "service",
    availability: 25,
    claimed: 8,
    expiryDate: new Date("2024-06-30"),
    isActive: true,
  },
  {
    id: "4",
    title: "Jansetu T-Shirt",
    description: "Official Jansetu community volunteer t-shirt",
    pointsCost: 200,
    category: "merchandise",
    availability: 200,
    claimed: 45,
    isActive: true,
  },
]

/**
 * API Functions - Replace with actual backend calls
 */

export async function fetchCommunityEvents(): Promise<CommunityEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_EVENTS
}

export async function fetchVolunteers(): Promise<Volunteer[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return MOCK_VOLUNTEERS
}

export async function fetchForumPosts(): Promise<ForumPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_FORUM_POSTS
}

export async function fetchRewards(): Promise<Reward[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return MOCK_REWARDS
}

export function getCategoryColor(category: CommunityEvent["category"]): string {
  const colors = {
    cleanup: "bg-green-100 text-green-800",
    meeting: "bg-blue-100 text-blue-800",
    workshop: "bg-purple-100 text-purple-800",
    emergency: "bg-red-100 text-red-800",
    social: "bg-pink-100 text-pink-800",
  }
  return colors[category]
}

export function getCategoryIcon(category: CommunityEvent["category"]): string {
  const icons = {
    cleanup: "🧹",
    meeting: "🏛️",
    workshop: "📚",
    emergency: "🚨",
    social: "🎉",
  }
  return icons[category]
}

export function getAuthorRoleColor(role: ForumPost["authorRole"]): string {
  const colors = {
    citizen: "bg-gray-100 text-gray-800",
    official: "bg-blue-100 text-blue-800",
    volunteer: "bg-green-100 text-green-800",
  }
  return colors[role]
}
