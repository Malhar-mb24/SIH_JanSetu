'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { 
  Calendar, 
  MapPin, 
  AlertCircle, 
  Clock, 
  User, 
  ArrowLeft,
  Image as ImageIcon,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StaffAssignment } from './staff-assignment'
import { SLAMonitor } from './sla-monitor'

type IssueStatus = 'new' | 'in_progress' | 'resolved' | 'rejected'
type IssuePriority = 'low' | 'medium' | 'high' | 'critical'

interface Issue {
  id: string
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  type: string
  category: string
  location: {
    address: string
    lat: number
    lng: number
  }
  reporter: {
    id: string
    name: string
    email: string
    phone?: string
    isVerified: boolean
  }
  assignedTo?: {
    id: string
    name: string
    role: string
  }
  reportedAt: string
  updatedAt: string
  slaDeadline: string
  images: string[]
  history: Array<{
    id: string
    action: string
    description: string
    timestamp: string
    user: {
      id: string
      name: string
      role: string
    }
  }>
}

// Mock data - Replace with API call in production
const MOCK_ISSUE: Issue = {
  id: 'issue_123',
  title: 'Garbage pileup at Main Road',
  description: 'There is a large pile of garbage accumulating near the market area. It has been there for over 2 days and is causing a foul smell in the neighborhood.',
  status: 'in_progress',
  priority: 'high',
  type: 'garbage',
  category: 'Sanitation',
  location: {
    address: 'Main Road, Ranchi, Jharkhand 834001',
    lat: 23.3441,
    lng: 85.3096
  },
  reporter: {
    id: 'user_456',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 9876543210',
    isVerified: true
  },
  assignedTo: {
    id: 'staff_1',
    name: 'Rahul Kumar',
    role: 'Sanitation Worker'
  },
  reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
  updatedAt: new Date().toISOString(),
  slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(), // 18 hours from now
  images: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80'
  ],
  history: [
    {
      id: 'event_1',
      action: 'created',
      description: 'Issue reported',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      user: {
        id: 'user_456',
        name: 'Amit Kumar',
        role: 'Citizen'
      }
    },
    {
      id: 'event_2',
      action: 'assigned',
      description: 'Assigned to Sanitation Department',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      user: {
        id: 'user_789',
        name: 'Priya Singh',
        role: 'Manager'
      }
    },
    {
      id: 'event_3',
      action: 'status_changed',
      description: 'Status changed to In Progress',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      user: {
        id: 'staff_1',
        name: 'Rahul Kumar',
        role: 'Sanitation Worker'
      }
    }
  ]
}

const statusBadge = {
  new: {
    label: 'New',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
}

const priorityBadge = {
  critical: {
    label: 'Critical',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
  high: {
    label: 'High',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  low: {
    label: 'Low',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
}

export function IssueDetails() {
  const params = useParams()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch issue details
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        setIssue(MOCK_ISSUE)
      } catch (error) {
        console.error('Failed to fetch issue:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchIssue()
    }
  }, [params.id])

  const handleStatusChange = async (newStatus: IssueStatus) => {
    if (!issue) return
    
    try {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Update local state
      setIssue({
        ...issue,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        history: [
          ...issue.history,
          {
            id: `event_${Date.now()}`,
            action: 'status_changed',
            description: `Status changed to ${newStatus.replace('_', ' ')}`,
            timestamp: new Date().toISOString(),
            user: {
              id: 'user_123', // Current user
              name: 'Admin User',
              role: 'Admin'
            }
          }
        ]
      })
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !issue) return
    
    try {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update local state
      setIssue({
        ...issue,
        history: [
          ...issue.history,
          {
            id: `comment_${Date.now()}`,
            action: 'commented',
            description: comment,
            timestamp: new Date().toISOString(),
            user: {
              id: 'user_123', // Current user
              name: 'Admin User',
              role: 'Admin'
            }
          }
        ]
      })
      
      // Clear comment
      setComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Issue not found</h3>
        <p className="mt-1 text-sm text-gray-500">The requested issue could not be found.</p>
        <div className="mt-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to issues
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{issue.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge className={statusBadge[issue.status].className}>
              {statusBadge[issue.status].label}
            </Badge>
            <Badge className={priorityBadge[issue.priority].className}>
              {priorityBadge[issue.priority].label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              #{issue.id.replace('issue_', '')}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {issue.status !== 'resolved' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleStatusChange('resolved')}
              disabled={isSubmitting}
              className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Resolved
            </Button>
          )}
          {issue.status !== 'rejected' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleStatusChange('rejected')}
              disabled={isSubmitting}
              className="text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject Issue
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1 whitespace-pre-line">{issue.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                  <p className="mt-1">{issue.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                  <p className="mt-1 capitalize">{issue.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Reported By</h3>
                  <div className="mt-1 flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{issue.reporter.name}</span>
                    {issue.reporter.isVerified && (
                      <Badge variant="outline" className="ml-2 text-xs">Verified</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Reported On</h3>
                  <div className="mt-1 flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {format(new Date(issue.reportedAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <div className="mt-1 flex items-center">
                    <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate">{issue.location.address}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {issue.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {issue.images.map((image, index) => (
                    <div key={index} className="group relative aspect-square overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt={`Issue attachment ${index + 1}`}
                        className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-full items-center justify-center">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <ImageIcon className="h-5 w-5" />
                            <span className="sr-only">View image</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <Tabs defaultValue="timeline" className="w-full">
              <CardHeader className="pb-0">
                <TabsList>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="timeline" className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                    <div className="space-y-6">
                      {[...issue.history].reverse().map((event) => (
                        <div key={event.id} className="relative pl-10">
                          <div className="absolute left-5 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-500"></div>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium">{event.description}</p>
                              <div className="mt-1 flex items-center text-sm text-muted-foreground">
                                <span>{event.user.name}</span>
                                <span className="mx-2">•</span>
                                <time dateTime={event.timestamp}>
                                  {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                                </time>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {event.user.role}
                            </Badge>
                          </div>
                          
                          {event.action === 'commented' && (
                            <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-800">
                              {event.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="comments">
                  <div className="space-y-4">
                    <form onSubmit={handleAddComment} className="space-y-4">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={isSubmitting}
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button type="submit" disabled={!comment.trim() || isSubmitting}>
                          {isSubmitting ? 'Posting...' : 'Post comment'}
                        </Button>
                      </div>
                    </form>
                    
                    <div className="space-y-6 pt-4">
                      {issue.history
                        .filter(event => event.action === 'commented')
                        .reverse()
                        .map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <Avatar>
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.user.name)}`} />
                              <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">{comment.user.name}</h4>
                                <time 
                                  dateTime={comment.timestamp} 
                                  className="text-xs text-muted-foreground"
                                >
                                  {format(new Date(comment.timestamp), 'MMM d, yyyy h:mm a')}
                                </time>
                              </div>
                              <p className="text-sm">{comment.description}</p>
                            </div>
                          </div>
                        ))}
                      
                      {issue.history.filter(event => event.action === 'commented').length === 0 && (
                        <div className="py-8 text-center">
                          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Be the first to comment on this issue.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <SLAMonitor 
            reportedAt={issue.reportedAt}
            slaDeadline={issue.slaDeadline}
            status={issue.status}
            priority={issue.priority}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <StaffAssignment 
                issueId={issue.id}
                currentAssignee={issue.assignedTo || undefined}
                onAssignmentComplete={() => {
                  // Refresh issue data or update local state
                  console.log('Assignment updated')
                }}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Reporter Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{issue.reporter.name}</p>
                    <p className="text-sm text-muted-foreground">{issue.reporter.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-24 text-muted-foreground">Phone</span>
                    <span>{issue.reporter.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-muted-foreground">Status</span>
                    <Badge variant={issue.reporter.isVerified ? 'default' : 'outline'}>
                      {issue.reporter.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-muted-foreground">Reported</span>
                    <div className="flex items-center">
                      <ClockIcon className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                      <span>{format(new Date(issue.reportedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Reporter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
