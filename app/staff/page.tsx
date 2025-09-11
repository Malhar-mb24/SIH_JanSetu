'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useULB } from '@/contexts/ulb-context'
import { Search, Filter, UserPlus, UserCheck, UserX, MoreHorizontal, X } from 'lucide-react'

// Mock data for staff members
const staffMembers = [
  {
    id: 'staff1',
    name: 'Rahul Kumar',
    designation: 'Field Officer',
    department: 'Sanitation',
    contact: '+91 98765 43210',
    status: 'active',
    assignedIssues: 2,
    lastActive: '2 hours ago'
  },
  {
    id: 'staff2',
    name: 'Priya Singh',
    designation: 'Sanitation Inspector',
    department: 'Public Health',
    contact: '+91 98765 43211',
    status: 'active',
    assignedIssues: 4,
    lastActive: '30 minutes ago'
  },
  {
    id: 'staff3',
    name: 'Amit Patel',
    designation: 'Junior Engineer',
    department: 'Public Works',
    contact: '+91 98765 43212',
    status: 'inactive',
    assignedIssues: 0,
    lastActive: '5 hours ago'
  },
]

// Add Staff Dialog Component
function AddStaffDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual staff creation logic
    console.log('Adding staff:', formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Select 
              value={formData.department}
              onValueChange={(value) => setFormData({...formData, department: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sanitation">Sanitation</SelectItem>
                <SelectItem value="public_works">Public Works</SelectItem>
                <SelectItem value="public_health">Public Health</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => setFormData({...formData, designation: e.target.value})}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Staff</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function StaffPage() {
  const { user } = useULB();
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if user has any of the required roles
  if (!user || !['super_admin', 'admin', 'commissioner'].includes(user.role)) {
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
          <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage staff members and their assignments
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button 
            size="sm" 
            className="h-8"
            onClick={() => setIsAddStaffOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
          <AddStaffDialog 
            open={isAddStaffOpen} 
            onOpenChange={setIsAddStaffOpen} 
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Staff Members</CardTitle>
            <div className="relative w-full max-w-sm md:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Assigned Issues</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers
                .filter(staff => 
                  searchQuery === '' || 
                  staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  staff.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  staff.department.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span>{staff.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{staff.designation}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{staff.department}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{staff.contact}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-2 ${
                        staff.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      <span className="capitalize">{staff.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`h-8 ${staff.assignedIssues > 0 ? 'hover:bg-blue-50' : ''}`}
                      onClick={() => {
                        // TODO: Navigate to issues assigned to this staff
                        console.log(`View issues for ${staff.name}`);
                      }}
                    >
                      <span className={`font-medium ${
                        staff.assignedIssues > 0 ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {staff.assignedIssues} {staff.assignedIssues === 1 ? 'issue' : 'issues'}
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {staff.lastActive}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
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
