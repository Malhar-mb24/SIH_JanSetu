"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Activity, CheckCircle, AlertCircle, UserPlus, MessageSquare } from "lucide-react"

interface ActivityItem {
  id: string
  type: "issue_created" | "issue_resolved" | "user_joined" | "comment_added"
  title: string
  description: string
  user: string
  timestamp: Date
  priority?: "low" | "medium" | "high" | "critical"
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "issue_created",
    title: "New critical issue reported",
    description: "Garbage Collection Missed in Green Park Extension",
    user: "System",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    priority: "critical",
  },
  {
    id: "2",
    type: "issue_resolved",
    title: "Issue resolved",
    description: "Water Leakage on Central Avenue has been fixed",
    user: "Water Department",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    type: "comment_added",
    title: "Comment added",
    description: "Work in progress on Main Street pothole repair",
    user: "Public Works Team",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: "4",
    type: "user_joined",
    title: "New staff member",
    description: "Field Agent Sarah joined the team",
    user: "HR Department",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
  {
    id: "5",
    type: "issue_created",
    title: "New issue reported",
    description: "Broken Street Light on Park Avenue",
    user: "System",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    priority: "medium",
  },
]

export function ActivityFeed() {
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "issue_created":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "issue_resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "user_joined":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "comment_added":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null

    const colors = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    }

    return <Badge className={`text-xs ${colors[priority as keyof typeof colors]}`}>{priority}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_ACTIVITIES.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  {getPriorityBadge(activity.priority)}
                </div>

                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>

                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">{activity.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{activity.user}</span>
                  <span className="text-xs text-muted-foreground">• {formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
