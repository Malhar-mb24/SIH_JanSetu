"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, MessageSquare, Award } from "lucide-react"
import { EventsCalendar } from "@/components/community/events-calendar"
import { VolunteerHub } from "@/components/community/volunteer-hub"
import { Forum } from "@/components/community/forum"
import {
  fetchCommunityEvents,
  fetchVolunteers,
  fetchForumPosts,
  type CommunityEvent,
  type Volunteer,
  type ForumPost,
} from "@/lib/community-data"

function CommunityContent() {
  const { user, logout } = useAuth()
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        const [eventsData, volunteersData, forumData] = await Promise.all([
          fetchCommunityEvents(),
          fetchVolunteers(),
          fetchForumPosts(),
        ])
        setEvents(eventsData)
        setVolunteers(volunteersData)
        setForumPosts(forumData)
      } catch (error) {
        console.error("Failed to load community data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCommunityData()
  }, [])

  const handleEventRegister = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === eventId ? { ...event, attendees: event.attendees + 1 } : event)),
    )
    console.log("Registered for event:", eventId)
  }

  const handleCreatePost = (newPost: Omit<ForumPost, "id" | "createdAt" | "updatedAt">) => {
    const post: ForumPost = {
      ...newPost,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setForumPosts((prevPosts) => [post, ...prevPosts])
  }

  const handleLikePost = (postId: string) => {
    setForumPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)),
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading community data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-2 bg-green-600 rounded-lg">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Community Engagement</h1>
          <p className="text-slate-600">Connect, participate, and make a difference</p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="volunteers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Volunteers
          </TabsTrigger>
          <TabsTrigger value="forum" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Forum
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          <EventsCalendar events={events} onEventRegister={handleEventRegister} />
        </TabsContent>

        <TabsContent value="volunteers" className="mt-6">
          <VolunteerHub volunteers={volunteers} events={events} currentUserPoints={1250} />
        </TabsContent>

        <TabsContent value="forum" className="mt-6">
          <Forum posts={forumPosts} onCreatePost={handleCreatePost} onLikePost={handleLikePost} />
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <div className="text-center py-12">
            <Award className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold mb-2">Rewards System</h3>
            <p className="text-slate-600">Coming soon! Earn points and redeem rewards for community participation.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function CommunityPage() {
  return (
    <ProtectedRoute requiredPermission="community.view">
      <DashboardLayout>
        <CommunityContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
