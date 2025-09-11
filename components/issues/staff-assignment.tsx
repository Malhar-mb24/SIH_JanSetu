'use client'

import { useState, useMemo } from 'react'
import { User, Users, Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useULB } from '@/contexts/ulb-context'
import { useToast } from '@/components/ui/use-toast'

interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  assignedIssues: number
}

interface StaffAssignmentProps {
  issueId: string
  currentAssignee?: {
    id: string
    name: string
  } | null
  onAssignmentComplete?: () => void
}

// Mock data - Replace with API call in production
const MOCK_STAFF: StaffMember[] = [
  {
    id: 'staff_1',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    role: 'Sanitation Worker',
    department: 'Sanitation',
    assignedIssues: 3,
  },
  {
    id: 'staff_2',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    role: 'Sanitation Supervisor',
    department: 'Sanitation',
    assignedIssues: 5,
  },
  {
    id: 'staff_3',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    role: 'Civil Engineer',
    department: 'Public Works',
    assignedIssues: 2,
  },
  {
    id: 'staff_4',
    name: 'Sunita Devi',
    email: 'sunita.devi@example.com',
    role: 'Electrical Technician',
    department: 'Electricity',
    assignedIssues: 1,
  },
]

export function StaffAssignment({ issueId, currentAssignee, onAssignmentComplete }: StaffAssignmentProps) {
  const [open, setOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(
    currentAssignee ? MOCK_STAFF.find(s => s.id === currentAssignee.id) || null : null
  )
  const [isAssigning, setIsAssigning] = useState(false)
  const { currentULB } = useULB()
  const { toast } = useToast()

  const handleAssign = async () => {
    if (!selectedStaff) return
    
    setIsAssigning(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Assignment Successful",
        description: `Issue has been assigned to ${selectedStaff.name}`,
      })
      
      onAssignmentComplete?.()
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "There was an error assigning the issue. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAssigning(false)
    }
  }

  const handleUnassign = async () => {
    setIsAssigning(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setSelectedStaff(null)
      
      toast({
        title: "Unassigned",
        description: "The staff member has been unassigned from this issue.",
      })
      
      onAssignmentComplete?.()
    } catch (error) {
      toast({
        title: "Failed to Unassign",
        description: "There was an error unassigning the staff member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAssigning(false)
    }
  }

  // Group staff by department
  const staffByDepartment = useMemo(() => {
    return MOCK_STAFF.reduce<Record<string, StaffMember[]>>((acc, staff) => {
      if (!acc[staff.department]) {
        acc[staff.department] = []
      }
      acc[staff.department].push(staff)
      return acc
    }, {})
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Assignment</h3>
        {selectedStaff && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleUnassign}
            disabled={isAssigning}
          >
            Unassign
          </Button>
        )}
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isAssigning}
          >
            {selectedStaff ? (
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 flex-shrink-0" />
                <div className="truncate text-left">
                  <div className="font-medium">{selectedStaff.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedStaff.role} • {selectedStaff.assignedIssues} assigned issues
                  </div>
                </div>
              </div>
            ) : (
              'Select staff member...'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search staff..." />
            <CommandEmpty>No staff found.</CommandEmpty>
            {Object.entries(staffByDepartment).map(([department, staffMembers]) => (
              <CommandGroup key={department} heading={department}>
                {staffMembers.map((staff) => (
                  <CommandItem
                    key={staff.id}
                    value={staff.id}
                    onSelect={() => {
                      setSelectedStaff(staff)
                      setOpen(false)
                    }}
                    className="flex flex-col items-start gap-1"
                  >
                    <div className="flex w-full items-center">
                      <User
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedStaff?.id === staff.id ? 'opacity-100' : 'opacity-40'
                        )}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{staff.name}</span>
                          {selectedStaff?.id === staff.id && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {staff.role} • {staff.assignedIssues} assigned issues
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex justify-end">
        <Button 
          onClick={handleAssign}
          disabled={!selectedStaff || isAssigning}
          className="w-full sm:w-auto"
        >
          {isAssigning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            'Confirm Assignment'
          )}
        </Button>
      </div>

      {currentULB && (
        <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          <p className="font-medium">ULB: {currentULB.name}</p>
          <p className="text-xs opacity-80">
            This issue will be assigned to a staff member within {currentULB.name}.
          </p>
        </div>
      )}
    </div>
  )
}
