"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, User, ArrowRight } from "lucide-react"
import type { Issue } from "@/lib/mock-data"
import { getPriorityColor, getStatusColor, getCategoryIcon } from "@/lib/mock-data"

interface RecentIssuesProps {
  issues: Issue[]
}

export function RecentIssues({ issues }: RecentIssuesProps) {
  const recentIssues = issues
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Issues
          </CardTitle>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentIssues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="text-lg">{getCategoryIcon(issue.category)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm truncate">{issue.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(issue.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{issue.description}</p>

                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`text-xs ${getPriorityColor(issue.priority)}`}>{issue.priority}</Badge>
                  <Badge className={`text-xs ${getStatusColor(issue.status)}`}>{issue.status}</Badge>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{issue.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{issue.reportedBy}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
