'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useULB } from '@/contexts/ulb-context'
import { Search, Filter, Phone, Mail, Clock, AlertTriangle, CheckCircle, FileText } from 'lucide-react'

// Mock data for officers
const officers = [
  {
    id: 'officer1',
    name: 'Vikram Mehta',
    designation: 'Municipal Commissioner',
    department: 'Administration',
    phone: '+91 98765 43210',
    email: 'commissioner@municipal.gov.in',
    availability: 'available',
    lastActive: '15 minutes ago'
  },
  {
    id: 'officer2',
    name: 'Anjali Deshpande',
    designation: 'Chief Engineer',
    department: 'Public Works',
    phone: '+91 98765 43211',
    email: 'ce@municipal.gov.in',
    availability: 'in-meeting',
    lastActive: '1 hour ago'
  },
  {
    id: 'officer3',
    name: 'Rajiv Malhotra',
    designation: 'Health Officer',
    department: 'Public Health',
    phone: '+91 98765 43212',
    email: 'health@municipal.gov.in',
    availability: 'available',
    lastActive: '30 minutes ago'
  },
]

// Mock data for issue timeline
const issueTimeline = [
  {
    id: 'issue-1001',
    title: 'Water Logging in Main Road',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'Rajiv Malhotra',
    timeline: [
      { time: '2 hours ago', event: 'Issue reported by citizen', status: 'reported' },
      { time: '1 hour ago', event: 'Assigned to field officer', status: 'assigned' },
      { time: '45 minutes ago', event: 'Inspection in progress', status: 'in-progress' },
    ]
  },
  {
    id: 'issue-1002',
    title: 'Garbage Not Collected',
    status: 'resolved',
    priority: 'medium',
    assignedTo: 'Anjali Deshpande',
    timeline: [
      { time: '1 day ago', event: 'Issue reported by citizen', status: 'reported' },
      { time: '20 hours ago', event: 'Assigned to sanitation team', status: 'assigned' },
      { time: '18 hours ago', event: 'Work in progress', status: 'in-progress' },
      { time: '2 hours ago', event: 'Issue resolved', status: 'resolved' },
    ]
  },
]

export default function AdminPage() {
  const { user } = useULB()

  // Only super_admin and admin roles can access this page
  if (!user || !['super_admin', 'admin'].includes(user.role)) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administration Dashboard</h1>
        <p className="text-muted-foreground">
          Manage municipal operations and track issue resolution
        </p>
      </div>

      <Tabs defaultValue="officers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="officers">Officer Contacts</TabsTrigger>
          <TabsTrigger value="issues">Issue Timeline</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="officers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Officer Directory</CardTitle>
                  <CardDescription>
                    Contact information for key municipal officers
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Officer</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {officers.map((officer) => (
                    <TableRow key={officer.id}>
                      <TableCell>
                        <div className="font-medium">{officer.name}</div>
                        <div className="text-sm text-muted-foreground">{officer.designation}</div>
                      </TableCell>
                      <TableCell>{officer.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{officer.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{officer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={`h-2 w-2 rounded-full ${
                            officer.availability === 'available' ? 'bg-green-500' : 'bg-yellow-500'
                          } mr-2`} />
                          <span className="capitalize">
                            {officer.availability === 'available' ? 'Available' : 'In Meeting'}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Active {officer.lastActive}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">
                          Message
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Tracking</CardTitle>
              <CardDescription>
                Monitor and track the status of reported issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {issueTimeline.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{issue.title}</h3>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge variant={issue.status === 'resolved' ? 'default' : 'secondary'} className="capitalize">
                            {issue.status}
                          </Badge>
                          <Badge variant={issue.priority === 'high' ? 'destructive' : 'outline'} className="capitalize">
                            {issue.priority} priority
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Assigned to: {issue.assignedTo}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {issue.timeline.map((event, index) => (
                        <div key={index} className="relative pb-4 pl-6">
                          {index < issue.timeline.length - 1 && (
                            <div className="absolute left-2.5 top-2 h-full w-px bg-gray-200" />
                          )}
                          <div className="relative flex items-start">
                            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                              {event.status === 'resolved' ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : event.status === 'reported' ? (
                                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                              ) : (
                                <Clock className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium">{event.event}</p>
                              <p className="text-xs text-muted-foreground">{event.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and view system reports
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-32 flex-col items-center justify-center">
                <FileText className="mb-2 h-6 w-6" />
                <span>Issue Resolution Report</span>
              </Button>
              <Button variant="outline" className="h-32 flex-col items-center justify-center">
                <FileText className="mb-2 h-6 w-6" />
                <span>Staff Performance</span>
              </Button>
              <Button variant="outline" className="h-32 flex-col items-center justify-center">
                <FileText className="mb-2 h-6 w-6" />
                <span>Citizen Feedback</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
