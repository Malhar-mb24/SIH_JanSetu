"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Clock,
  Camera,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Star,
} from "lucide-react"
import {
  MOCK_ISSUES,
  type Issue,
  type TimelineEntry,
  getPriorityColor,
  getStatusColor,
  getCategoryIcon,
} from "@/lib/mock-data"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

/**
 * Issue Detail Page Component
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Implement real-time issue updates with WebSocket connections
 * - Add image upload functionality with cloud storage integration
 * - Implement comment system with real-time notifications
 * - Add file attachment support for documents and reports
 * - Implement audit trail for all issue modifications
 * - Add email notifications for status changes and assignments
 * - Implement role-based permissions for different actions
 * - Add integration with mapping services for location updates
 * - Implement citizen feedback collection system
 * - Add SLA tracking and automated escalation
 */
function IssueDetailContent() {
  const params = useParams()
  const router = useRouter()
  const issueId = params.id as string

  const [issue, setIssue] = useState<Issue | null>(null)
  const [newComment, setNewComment] = useState("")
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isResolving, setIsResolving] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch issue details
    const foundIssue = MOCK_ISSUES.find((i) => i.id === issueId)
    if (foundIssue) {
      setIssue(foundIssue)
    }
  }, [issueId])

  if (!issue) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Issue Not Found</h1>
        <Button onClick={() => router.push("/issues")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Issues
        </Button>
      </div>
    )
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const newTimelineEntry: TimelineEntry = {
      id: `t${Date.now()}`,
      type: "comment",
      timestamp: new Date(),
      user: "current-user@municipal.gov", // Replace with actual user
      userRole: "staff",
      content: newComment,
    }

    setIssue({
      ...issue,
      timeline: [...(issue.timeline || []), newTimelineEntry],
      updatedAt: new Date(),
    })
    setNewComment("")
  }

  const handleResolveIssue = () => {
    if (!resolutionNotes.trim()) return

    const resolutionEntry: TimelineEntry = {
      id: `t${Date.now()}`,
      type: "resolution",
      timestamp: new Date(),
      user: "current-user@municipal.gov",
      userRole: "staff",
      content: `Issue resolved: ${resolutionNotes}`,
      metadata: {
        oldValue: issue.status,
        newValue: "resolved",
        images: uploadedImages,
      },
    }

    setIssue({
      ...issue,
      status: "resolved",
      timeline: [...(issue.timeline || []), resolutionEntry],
      updatedAt: new Date(),
      resolutionDetails: {
        resolvedAt: new Date(),
        resolvedBy: "Current User - Staff Member", // Replace with actual user
        resolutionNotes,
        resolutionImages: uploadedImages,
      },
    })
    setIsResolving(false)
    setResolutionNotes("")
    setUploadedImages([])
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Mock image upload - Replace with actual upload logic
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(
        (file) => `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(file.name)}`,
      )
      setUploadedImages([...uploadedImages, ...newImages])
    }
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTimelineIcon = (type: TimelineEntry["type"]) => {
    switch (type) {
      case "status_change":
        return <AlertTriangle className="h-4 w-4" />
      case "comment":
        return <MessageSquare className="h-4 w-4" />
      case "assignment":
        return <User className="h-4 w-4" />
      case "image_upload":
        return <Camera className="h-4 w-4" />
      case "resolution":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button variant="outline" onClick={() => router.push("/issues")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Issues
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{issue.title}</h1>
            <p className="text-slate-600">Issue #{issue.id}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>Issue Details</CardTitle>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                  <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{issue.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{issue.location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created {formatDateTime(issue.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Reported by {issue.reportedBy}</span>
                </div>
                {issue.assignedTo && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-xs">{issue.assignedTo.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>Assigned to {issue.assignedTo}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          {issue.images && issue.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Issue Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {issue.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Issue image ${index + 1}`}
                      className="rounded-lg border w-full h-48 object-cover"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Interactive Map</p>
                  <p className="text-sm">
                    Lat: {issue.location.lat}, Lng: {issue.location.lng}
                  </p>
                  <p className="text-sm mt-2">{issue.location.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resolution Details */}
          {issue.resolutionDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resolution Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Resolved By</Label>
                    <p className="text-sm text-muted-foreground">{issue.resolutionDetails.resolvedBy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Resolved At</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(issue.resolutionDetails.resolvedAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Resolution Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">{issue.resolutionDetails.resolutionNotes}</p>
                </div>

                {issue.resolutionDetails.resolutionImages && (
                  <div>
                    <Label className="text-sm font-medium">Resolution Images</Label>
                    <div className="grid gap-4 md:grid-cols-2 mt-2">
                      {issue.resolutionDetails.resolutionImages.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Resolution image ${index + 1}`}
                          className="rounded-lg border w-full h-32 object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {issue.resolutionDetails.citizenFeedback && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label className="text-sm font-medium text-green-800">Citizen Feedback</Label>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < issue.resolutionDetails!.citizenFeedback!.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-green-700 ml-2">
                        {issue.resolutionDetails.citizenFeedback.rating}/5
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-2">"{issue.resolutionDetails.citizenFeedback.comment}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Issue Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issue.timeline?.map((entry, index) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {getTimelineIcon(entry.type)}
                      </div>
                      {index < (issue.timeline?.length || 0) - 1 && <div className="h-8 w-px bg-border mt-2" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {entry.userRole}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDateTime(entry.timestamp)}</span>
                      </div>
                      <p className="text-sm">{entry.content}</p>
                      <p className="text-xs text-muted-foreground">{entry.user}</p>
                      {entry.metadata?.images && (
                        <div className="grid gap-2 grid-cols-2 mt-2">
                          {entry.metadata.images.map((img, i) => (
                            <img
                              key={i}
                              src={img || "/placeholder.svg"}
                              alt={`Timeline image ${i + 1}`}
                              className="rounded border h-16 w-full object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {issue.status !== "resolved" && issue.status !== "closed" && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-2">
                  <Label htmlFor="comment">Add Comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Add a comment or update..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={handleAddComment} className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>

                <Separator />

                {/* Resolve Issue */}
                {!isResolving ? (
                  <Button onClick={() => setIsResolving(true)} className="w-full" variant="default">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resolution">Resolution Notes</Label>
                      <Textarea
                        id="resolution"
                        placeholder="Describe how the issue was resolved..."
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="images">Upload Resolution Images</Label>
                      <Input id="images" type="file" multiple accept="image/*" onChange={handleImageUpload} />
                      {uploadedImages.length > 0 && (
                        <div className="grid gap-2 grid-cols-2">
                          {uploadedImages.map((img, i) => (
                            <img
                              key={i}
                              src={img || "/placeholder.svg"}
                              alt={`Upload ${i + 1}`}
                              className="rounded border h-16 w-full object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleResolveIssue} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Resolution
                      </Button>
                      <Button variant="outline" onClick={() => setIsResolving(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default function IssueDetailPage() {
  return (
    <ProtectedRoute requiredPermission={["issues.view"]}>
      <DashboardLayout>
        <IssueDetailContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
