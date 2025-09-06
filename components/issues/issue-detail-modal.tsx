"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, User, MessageSquare, Camera, Clock, Edit, Save, Phone, Mail, ExternalLink } from "lucide-react"
import type { Issue } from "@/lib/mock-data"
import { getPriorityColor, getStatusColor, getCategoryIcon } from "@/lib/mock-data"

interface IssueDetailModalProps {
  issue: Issue | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (issueId: string, updates: Partial<Issue>) => void
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
  type: "comment" | "status_change" | "assignment"
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    author: "Public Works Team",
    content: "Issue has been assessed. We'll need to coordinate with traffic management for road closure.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: "comment",
  },
  {
    id: "2",
    author: "System",
    content: "Status changed from 'Open' to 'In Progress'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    type: "status_change",
  },
  {
    id: "3",
    author: "Traffic Manager",
    content: "Road closure approved for tomorrow 6 AM - 2 PM. All necessary permits obtained.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    type: "comment",
  },
]

/**
 * Issue Detail Modal Component
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Implement real-time comment updates with WebSocket
 * - Add file upload functionality for images and documents
 * - Implement audit trail for all issue changes
 * - Add integration with external systems (GIS, work orders, etc.)
 * - Implement notification system for stakeholders
 * - Add time tracking for work performed
 * - Consider implementing workflow automation
 */
export function IssueDetailModal({ issue, isOpen, onClose, onUpdate }: IssueDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [editedIssue, setEditedIssue] = useState<Partial<Issue>>({})

  if (!issue) return null

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleSave = () => {
    onUpdate(issue.id, editedIssue)
    setIsEditing(false)
    setEditedIssue({})
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In real implementation, this would call an API
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }

  const getTimeElapsed = () => {
    const now = new Date()
    const created = new Date(issue.createdAt)
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) return `${diffInHours} hours`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full md:max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg md:text-xl flex items-center gap-3">
                <span className="text-xl md:text-2xl">{getCategoryIcon(issue.category)}</span>
                {issue.title}
              </DialogTitle>
              <DialogDescription className="mt-2">
                Issue #{issue.id} • Created {formatDateTime(issue.createdAt)}
              </DialogDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
              <Badge className={`${getPriorityColor(issue.priority)}`}>{issue.priority}</Badge>
              <Badge className={`${getStatusColor(issue.status)}`}>{issue.status}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{issue.description}</p>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium">{issue.location.address}</p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {issue.location.lat}, {issue.location.lng}
                </p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Activity & Comments
              </h3>

              <div className="space-y-4">
                {MOCK_COMMENTS.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{formatDateTime(comment.timestamp)}</span>
                        {comment.type === "status_change" && (
                          <Badge variant="outline" className="text-xs w-fit">
                            Status Change
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground break-words">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <Textarea
                  placeholder="Add a comment or update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()} className="w-full sm:w-auto">
                  Add Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel Edit" : "Edit Issue"}
                </Button>
                {isEditing && (
                  <Button className="w-full justify-start" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
            </div>

            {/* Issue Details */}
            <div>
              <h3 className="font-semibold mb-3">Issue Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  {isEditing ? (
                    <Select
                      value={editedIssue.priority || issue.priority}
                      onValueChange={(value) =>
                        setEditedIssue({ ...editedIssue, priority: value as Issue["priority"] })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge className={`${getPriorityColor(issue.priority)}`}>{issue.priority}</Badge>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  {isEditing ? (
                    <Select
                      value={editedIssue.status || issue.status}
                      onValueChange={(value) => setEditedIssue({ ...editedIssue, status: value as Issue["status"] })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(issue.status)}`}>{issue.status}</Badge>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <div className="mt-1 text-sm capitalize">{issue.category}</div>
                </div>

                <div>
                  <label className="text-sm font-medium">Time Elapsed</label>
                  <div className="mt-1 text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {getTimeElapsed()}
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment */}
            <div>
              <h3 className="font-semibold mb-3">Assignment</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Reported By</label>
                  <div className="mt-1 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{issue.reportedBy}</span>
                  </div>
                </div>

                {issue.assignedTo && (
                  <div>
                    <label className="text-sm font-medium">Assigned To</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{issue.assignedTo.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{issue.assignedTo}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Reporter
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Reporter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
