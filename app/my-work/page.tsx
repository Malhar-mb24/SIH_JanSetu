'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { CheckCircle, Clock, AlertCircle, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useULB } from '@/contexts/ulb-context'
import { Skeleton } from '@/components/ui/skeleton'

type IssueStatus = 'all' | 'new' | 'in_progress' | 'resolved' | 'overdue'

type Issue = {
  id: string
  title: string
  status: 'new' | 'in_progress' | 'resolved' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  location: string
  reportedAt: string
  slaDeadline: string
}

// Mock data
const MOCK_ISSUES: Issue[] = [
  {
    id: 'issue_101',
    title: 'Garbage pileup at Main Road',
    status: 'in_progress',
    priority: 'high',
    category: 'Sanitation',
    location: 'Main Road, Ranchi',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'issue_102',
    title: 'Street light not working',
    status: 'new',
    priority: 'medium',
    category: 'Electricity',
    location: 'Gandhi Nagar, Ranchi',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 11).toISOString(),
  },
  {
    id: 'issue_103',
    title: 'Water logging on road',
    status: 'in_progress',
    priority: 'critical',
    category: 'Drainage',
    location: 'Lalpur, Ranchi',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString(),
  },
  {
    id: 'issue_104',
    title: 'Broken water pipeline',
    status: 'resolved',
    priority: 'high',
    category: 'Water Supply',
    location: 'Hinoo, Ranchi',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    slaDeadline: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'issue_105',
    title: 'Pothole on main road',
    status: 'in_progress',
    priority: 'medium',
    category: 'Roads',
    location: 'Doranda, Ranchi',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
  }
]

export default function MyWorkPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<IssueStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [issues, setIssues] = useState<Issue[]>([])

  // Fetch assigned issues
  useEffect(() => {
    const fetchAssignedIssues = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        setIssues(MOCK_ISSUES)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignedIssues()
  }, [])

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesStatus = activeTab === 'all' || 
                         (activeTab === 'overdue' 
                           ? issue.status !== 'resolved' && new Date(issue.slaDeadline) < new Date()
                           : issue.status === activeTab)
      const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.location.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [issues, activeTab, searchQuery])

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Work</h1>
          <p className="text-muted-foreground">
            Manage your assigned issues and track their progress
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-10 md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard 
          title="Total Assigned" 
          value={issues.length} 
          icon={CheckCircle}
          description={`${issues.length} total issues`}
        />
        <StatCard 
          title="In Progress" 
          value={issues.filter(i => i.status === 'in_progress').length} 
          icon={Clock}
          description="Active tasks"
        />
        <StatCard 
          title="Overdue" 
          value={issues.filter(i => i.status !== 'resolved' && new Date(i.slaDeadline) < new Date()).length} 
          icon={AlertCircle}
          description="Past due"
        />
        <StatCard 
          title="Resolved" 
          value={issues.filter(i => i.status === 'resolved').length} 
          icon={CheckCircle}
          description="Completed tasks"
        />
      </div>

      <Card>
        <div className="space-y-4 p-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'new', 'in_progress', 'overdue', 'resolved'].map((tab) => {
              const tabLabel = tab === 'in_progress' ? 'In Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)
              const isActive = activeTab === tab
              return (
                <Button
                  key={tab}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(tab as IssueStatus)}
                >
                  {tabLabel}
                </Button>
              )
            })}
          </div>
          
          <div className="space-y-2">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onClick={() => router.push(`/issues/${issue.id}`)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No issues found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, description }: { title: string; value: number; icon: any; description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function IssueCard({ issue, onClick }: { issue: Issue; onClick: () => void }) {
  const isOverdue = issue.status !== 'resolved' && new Date(issue.slaDeadline) < new Date()
  
  return (
    <div 
      className="flex cursor-pointer items-center justify-between rounded-md border p-4 transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="mt-1">
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium">{issue.title}</h3>
          <p className="text-sm text-muted-foreground">{issue.location}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {issue.priority}
            </Badge>
            <Badge variant={issue.status === 'resolved' ? 'default' : 'outline'} className="text-xs">
              {issue.status.replace('_', ' ')}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          Due {format(new Date(issue.slaDeadline), 'MMM d, h:mm a')}
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      </div>
    </div>
  )
}
