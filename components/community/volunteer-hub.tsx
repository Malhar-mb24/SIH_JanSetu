"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Users, Clock, Star, Trophy, Target, Calendar, MapPin } from "lucide-react"
import type { Volunteer, CommunityEvent } from "@/lib/community-data"

interface VolunteerHubProps {
  volunteers: Volunteer[]
  events: CommunityEvent[]
  currentUserPoints?: number
}

/**
 * Volunteer Hub Component
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Implement volunteer registration and verification system
 * - Add skill-based matching for events and opportunities
 * - Implement volunteer hour tracking and verification
 * - Add background check integration for sensitive roles
 * - Implement automated volunteer recognition and rewards
 * - Add volunteer scheduling and availability management
 * - Consider integration with external volunteer platforms
 */
export function VolunteerHub({ volunteers, events, currentUserPoints = 0 }: VolunteerHubProps) {
  const [selectedTab, setSelectedTab] = useState("overview")

  const totalVolunteers = volunteers.length
  const activeVolunteers = volunteers.filter((v) => v.isActive).length
  const totalHours = volunteers.reduce((sum, v) => sum + v.totalHours, 0)
  const avgHoursPerVolunteer = Math.round(totalHours / totalVolunteers)

  const topVolunteers = volunteers.sort((a, b) => b.points - a.points).slice(0, 5)

  const upcomingVolunteerEvents = events.filter(
    (event) =>
      event.status === "upcoming" &&
      (event.category === "cleanup" || event.category === "workshop" || event.category === "emergency"),
  )

  const getNextBadge = (points: number) => {
    const badges = [
      { name: "Newcomer", points: 0 },
      { name: "Helper", points: 100 },
      { name: "Contributor", points: 500 },
      { name: "Champion", points: 1000 },
      { name: "Hero", points: 2000 },
      { name: "Legend", points: 5000 },
    ]

    const currentBadge = badges.reverse().find((badge) => points >= badge.points)
    const nextBadge = badges.find((badge) => points < badge.points)

    return { current: currentBadge, next: nextBadge }
  }

  const { current: currentBadge, next: nextBadge } = getNextBadge(currentUserPoints)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Volunteer Hub</h2>
          <p className="text-muted-foreground">Connect with volunteers and contribute to your community</p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Become a Volunteer
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{totalVolunteers}</div>
                <div className="text-sm text-muted-foreground">Total Volunteers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{activeVolunteers}</div>
                <div className="text-sm text-muted-foreground">Active This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{totalHours}</div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{avgHoursPerVolunteer}</div>
                <div className="text-sm text-muted-foreground">Avg Hours/Volunteer</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="rewards">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Volunteers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Volunteers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {volunteers.slice(0, 5).map((volunteer) => (
                    <div key={volunteer.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{volunteer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {volunteer.totalHours} hours • {volunteer.eventsAttended} events
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.badges.slice(0, 2).map((badge) => (
                          <Badge key={badge} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Volunteer Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { skill: "Event Organization", count: 12 },
                    { skill: "Teaching", count: 8 },
                    { skill: "First Aid", count: 6 },
                    { skill: "Technical Support", count: 5 },
                    { skill: "Photography", count: 4 },
                  ].map((item) => (
                    <div key={item.skill} className="flex items-center justify-between">
                      <span className="text-sm">{item.skill}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(item.count / 15) * 100} className="w-20" />
                        <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top Volunteers This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topVolunteers.map((volunteer, index) => (
                  <div key={volunteer.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{volunteer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {volunteer.totalHours} hours • {volunteer.eventsAttended} events
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {volunteer.badges.slice(0, 3).map((badge) => (
                          <Badge key={badge} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{volunteer.points}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid gap-4">
            {upcomingVolunteerEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">
                          {event.category === "cleanup" ? "🧹" : event.category === "workshop" ? "📚" : "🚨"}
                        </span>
                        <h3 className="font-semibold">{event.title}</h3>
                        {event.rewards && (
                          <Badge variant="outline" className="ml-auto">
                            <Star className="h-3 w-3 mr-1" />
                            {event.rewards} pts
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees}/{event.maxAttendees}
                        </div>
                      </div>
                    </div>
                    <Button className="ml-4">Volunteer</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{currentUserPoints}</div>
                <div className="text-muted-foreground">Total Points Earned</div>
              </div>

              {nextBadge && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress to {nextBadge.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {currentUserPoints}/{nextBadge.points}
                    </span>
                  </div>
                  <Progress value={(currentUserPoints / nextBadge.points) * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {nextBadge.points - currentUserPoints} points to go
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-3">Your Badges</h4>
                <div className="grid grid-cols-2 gap-3">
                  {["Community Champion", "Environmental Hero", "Safety Expert", "Tech Volunteer"].map((badge) => (
                    <div key={badge} className="flex items-center gap-2 p-3 rounded-lg border">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <span className="text-sm font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
