"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, Star, ExternalLink, UserPlus } from "lucide-react"
import type { CommunityEvent } from "@/lib/community-data"
import { getCategoryColor, getCategoryIcon } from "@/lib/community-data"

interface EventsCalendarProps {
  events: CommunityEvent[]
  onEventRegister: (eventId: string) => void
}

/**
 * Community Events Calendar Component
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Integrate with calendar APIs (Google Calendar, Outlook, etc.)
 * - Implement event registration with email confirmations
 * - Add waitlist functionality for full events
 * - Implement recurring event management
 * - Add event reminder notifications
 * - Consider integration with mapping services for directions
 * - Add event feedback and rating system
 */
export function EventsCalendar({ events, onEventRegister }: EventsCalendarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = ["all", "cleanup", "meeting", "workshop", "emergency", "social"]

  const filteredEvents = events.filter((event) => selectedCategory === "all" || event.category === selectedCategory)

  const upcomingEvents = filteredEvents.filter((event) => event.status === "upcoming")
  const ongoingEvents = filteredEvents.filter((event) => event.status === "ongoing")

  const formatEventDate = (date: Date, endDate?: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }

    if (endDate) {
      return `${date.toLocaleDateString("en-US", options)} - ${endDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    }

    return date.toLocaleDateString("en-US", options)
  }

  const getAttendancePercentage = (attendees: number, maxAttendees: number) => {
    return Math.round((attendees / maxAttendees) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Events</h2>
          <p className="text-muted-foreground">Join local events and make a difference in your community</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Organize Event
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category === "all" ? "All Events" : `${getCategoryIcon(category as any)} ${category}`}
          </Button>
        ))}
      </div>

      {/* Ongoing Events Alert */}
      {ongoingEvents.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-orange-800">Events Happening Now</span>
            </div>
            <div className="space-y-2">
              {ongoingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between">
                  <span className="text-sm text-orange-700">{event.title}</span>
                  <Button size="sm" variant="outline">
                    Join Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcomingEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                  <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                </div>
                {event.rewards && (
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{event.rewards} pts</span>
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatEventDate(event.date, event.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {event.attendees}/{event.maxAttendees} registered
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${getAttendancePercentage(event.attendees, event.maxAttendees)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{event.organizer.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">by {event.organizer}</span>
              </div>

              {event.tags && (
                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {event.registrationRequired ? (
                  <Button
                    className="flex-1"
                    onClick={() => onEventRegister(event.id)}
                    disabled={event.attendees >= event.maxAttendees}
                  >
                    {event.attendees >= event.maxAttendees ? "Full" : "Register"}
                  </Button>
                ) : (
                  <Button className="flex-1 bg-transparent" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {upcomingEvents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No upcoming events</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory === "all"
                ? "There are no upcoming events at the moment."
                : `No upcoming ${selectedCategory} events found.`}
            </p>
            <Button>Organize an Event</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
