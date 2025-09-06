"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  MapPin,
  Calendar,
  MessageSquare,
  Eye,
  Edit,
  Zap,
} from "lucide-react"
import type { Issue } from "@/lib/mock-data"
import { getPriorityColor, getStatusColor, getCategoryIcon } from "@/lib/mock-data"

interface IssueTriageHubProps {
  issues: Issue[]
  onIssueSelect: (issue: Issue) => void
  onIssueUpdate: (issueId: string, updates: Partial<Issue>) => void
}

/**
 * Issue Triage Hub Component
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Implement real-time issue updates with WebSocket connections
 * - Add AI-powered issue categorization and priority assignment
 * - Implement automatic assignment based on location and expertise
 * - Add bulk operations for multiple issue management
 * - Implement issue escalation workflows
 * - Add SLA tracking and automated notifications
 * - Consider implementing machine learning for pattern detection
 */
export function IssueTriageHub({ issues, onIssueSelect, onIssueUpdate }: IssueTriageHubProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("created")

  // Filter and sort issues
  const filteredIssues = issues
    .filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || issue.status === statusFilter
      const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
      const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        default:
          return 0
      }
    })

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getAISuggestion = (issue: Issue) => {
    // Mock AI suggestions - Replace with actual AI service
    const suggestions = {
      infrastructure: "Assign to Public Works Team - Estimated 2-3 days",
      sanitation: "High priority - Contact waste management immediately",
      utilities: "Check with utility providers - May require emergency response",
      safety: "Immediate attention required - Dispatch security team",
      environment: "Environmental assessment needed - Contact EPA team",
    }
    return suggestions[issue.category] || "Review and assign appropriate team"
  }

  const criticalCount = issues.filter((i) => i.priority === "critical").length
  const openCount = issues.filter((i) => i.status === "open").length
  const inProgressCount = issues.filter((i) => i.status === "in-progress").length

  return (
    <div className="space-y-6">
      {/* Triage Overview */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-red-600">{criticalCount}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Critical Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-orange-600">{openCount}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Awaiting Triage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-blue-600">{inProgressCount}</div>
                <div className="text-xs md:text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-purple-600">
                  {Math.round((issues.filter((i) => i.status === "resolved").length / issues.length) * 100)}%
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Resolution Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Filter className="h-5 w-5" />
            Issue Triage & Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-full sm:min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues, locations, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="sanitation">Sanitation</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Issue Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 min-w-max md:min-w-full">
                <TabsTrigger value="all" className="text-xs md:text-sm">
                  All Issues ({filteredIssues.length})
                </TabsTrigger>
                <TabsTrigger value="critical" className="text-xs md:text-sm">
                  Critical ({filteredIssues.filter((i) => i.priority === "critical").length})
                </TabsTrigger>
                <TabsTrigger value="unassigned" className="text-xs md:text-sm">
                  Unassigned ({filteredIssues.filter((i) => !i.assignedTo).length})
                </TabsTrigger>
                <TabsTrigger value="overdue" className="text-xs md:text-sm">
                  Overdue (2)
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-6">
              <IssueList
                issues={filteredIssues}
                onIssueSelect={onIssueSelect}
                onIssueUpdate={onIssueUpdate}
                formatTimeAgo={formatTimeAgo}
                getAISuggestion={getAISuggestion}
              />
            </TabsContent>

            <TabsContent value="critical" className="mt-6">
              <IssueList
                issues={filteredIssues.filter((i) => i.priority === "critical")}
                onIssueSelect={onIssueSelect}
                onIssueUpdate={onIssueUpdate}
                formatTimeAgo={formatTimeAgo}
                getAISuggestion={getAISuggestion}
              />
            </TabsContent>

            <TabsContent value="unassigned" className="mt-6">
              <IssueList
                issues={filteredIssues.filter((i) => !i.assignedTo)}
                onIssueSelect={onIssueSelect}
                onIssueUpdate={onIssueUpdate}
                formatTimeAgo={formatTimeAgo}
                getAISuggestion={getAISuggestion}
              />
            </TabsContent>

            <TabsContent value="overdue" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No overdue issues at this time</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface IssueListProps {
  issues: Issue[]
  onIssueSelect: (issue: Issue) => void
  onIssueUpdate: (issueId: string, updates: Partial<Issue>) => void
  formatTimeAgo: (date: Date) => string
  getAISuggestion: (issue: Issue) => string
}

function IssueList({ issues, onIssueSelect, onIssueUpdate, formatTimeAgo, getAISuggestion }: IssueListProps) {
  const router = useRouter()

  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No issues match your current filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Card key={issue.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="text-2xl flex-shrink-0">{getCategoryIcon(issue.category)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base md:text-lg mb-1 break-words">{issue.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{issue.description}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={`${getPriorityColor(issue.priority)} text-xs`}>{issue.priority}</Badge>
                    <Badge className={`${getStatusColor(issue.status)} text-xs`}>{issue.status}</Badge>
                  </div>
                </div>

                <div className="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{issue.location.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Created {formatTimeAgo(issue.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{issue.reportedBy}</span>
                  </div>
                  {issue.assignedTo && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-4 w-4 flex-shrink-0">
                        <AvatarFallback className="text-xs">{issue.assignedTo.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{issue.assignedTo}</span>
                    </div>
                  )}
                </div>

                {/* AI Suggestion */}
                <div className="bg-accent/50 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-purple-800">AI Suggestion</div>
                      <div className="text-sm text-purple-700 break-words">{getAISuggestion(issue)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/issues/${issue.id}`)}
                      className="justify-start"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start bg-transparent">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                  </div>

                  {!issue.assignedTo && (
                    <Button
                      size="sm"
                      onClick={() =>
                        onIssueUpdate(issue.id, {
                          assignedTo: "Auto-assigned Team",
                          status: "in-progress",
                        })
                      }
                      className="w-full sm:w-auto"
                    >
                      Auto-Assign
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
