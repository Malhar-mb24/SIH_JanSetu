'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useULB } from '@/contexts/ulb-context'
import { Search, Filter, UserPlus } from 'lucide-react'

// Mock data for staff assignments
const staffAssignments = [
  {
    id: 'staff1',
    name: 'Rahul Kumar',
    designation: 'Field Officer',
    currentIssues: 2,
    maxIssues: 5,
    status: 'available',
    lastActive: '2 hours ago'
  },
  {
    id: 'staff2',
    name: 'Priya Singh',
    designation: 'Sanitation Inspector',
    currentIssues: 4,
    maxIssues: 5,
    status: 'busy',
    lastActive: '30 minutes ago'
  },
  {
    id: 'staff3',
    name: 'Amit Patel',
    designation: 'Junior Engineer',
    currentIssues: 1,
    maxIssues: 5,
    status: 'available',
    lastActive: '5 hours ago'
  },
]

export default function UsersPage() {
  const { hasPermission } = useULB()

  if (!hasPermission('user:view')) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to view this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Assignments</h1>
          <p className="text-muted-foreground">
            Manage staff assignments and workload distribution
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="h-8">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Staff Members</CardTitle>
            <div className="relative w-full max-w-sm md:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search staff..."
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead className="text-center">Workload</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffAssignments.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.designation}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className={`h-full ${
                            staff.currentIssues / staff.maxIssues > 0.7 ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{
                            width: `${(staff.currentIssues / staff.maxIssues) * 100}%`,
                            transition: 'width 0.3s ease-in-out'
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {staff.currentIssues}/{staff.maxIssues}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={staff.status === 'available' ? 'default' : 'destructive'}
                      className="capitalize"
                    >
                      {staff.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {staff.lastActive}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      Assign Issue
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
