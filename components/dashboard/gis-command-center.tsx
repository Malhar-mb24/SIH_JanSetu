'use client'

import { useState, useMemo } from 'react'
import { MapPin, Filter, Clock, AlertCircle, CheckCircle, Search, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

type IssueType = 'garbage' | 'pothole' | 'street_light' | 'water_leak' | 'other'
type IssueStatus = 'new' | 'in_progress' | 'resolved'
type Priority = 'low' | 'medium' | 'high' | 'critical'

interface Issue {
  id: string
  type: IssueType
  status: IssueStatus
  priority: Priority
  title: string
  description: string
  location: {
    lat: number
    lng: number
    address: string
  }
  reportedAt: string
  assignedTo?: string
  slaDeadline: string
}

const PRIORITY_LABELS = {
  critical: { label: 'Critical', color: 'bg-red-100 text-red-800' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-800' }
} as const

const STATUS_LABELS = {
  new: { label: 'New', color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800' }
} as const

export function GisCommandCenter() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: ['new', 'in_progress'] as IssueStatus[],
    priority: ['high', 'critical'] as Priority[],
    type: ['garbage', 'pothole', 'street_light', 'water_leak', 'other'] as IssueType[]
  })
  const [isCreatingIssue, setIsCreatingIssue] = useState(false)

  // Mock data
  const issues: Issue[] = [
    {
      id: '1',
      type: 'garbage',
      status: 'new',
      priority: 'high',
      title: 'Garbage pileup near Main Street',
      description: 'Large pile of garbage accumulating near the intersection',
      location: {
        lat: 23.3445,
        lng: 85.3096,
        address: 'Main Street, Ranchi'
      },
      reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: '2',
      type: 'pothole',
      status: 'in_progress',
      priority: 'critical',
      title: 'Large pothole on MG Road',
      description: 'Deep pothole causing traffic issues',
      location: {
        lat: 23.3541,
        lng: 85.3096,
        address: 'MG Road, Ranchi'
      },
      reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString()
    }
  ]

  const toggleFilter = <T extends 'status' | 'priority' | 'type'>(
    type: T,
    value: T extends 'status' ? IssueStatus : 
           T extends 'priority' ? Priority :
           IssueType
  ) => {
    setFilters(prev => {
      const currentValues = [...prev[type]] as string[]
      const newValues = currentValues.includes(value as string)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value as string]
      
      return {
        ...prev,
        [type]: newValues
      }
    })
  }

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      // Filter by status, type, and priority
      const matchesFilters = 
        filters.status.includes(issue.status) &&
        filters.type.includes(issue.type) &&
        filters.priority.includes(issue.priority)
      
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesFilters && matchesSearch
    })
  }, [filters, searchQuery])

  // Calculate KPI metrics
  const kpiData = useMemo(() => ({
    totalIssues: issues.length,
    newIssues: issues.filter(i => i.status === 'new').length,
    inProgress: issues.filter(i => i.status === 'in_progress').length,
    resolvedToday: issues.filter(i => 
      i.status === 'resolved' && 
      new Date(i.reportedAt).toDateString() === new Date().toDateString()
    ).length,
  }), [issues])

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      {/* Header with Search */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h1 className="text-2xl font-bold flex items-center">
            <MapPin className="h-6 w-6 text-blue-600 mr-2" />
            Municipal Issue Tracker
          </h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search issues..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* KPI and Filters Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Open Issues</span>
                  <Badge variant="outline">{kpiData.newIssues + kpiData.inProgress}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">In Progress</span>
                  <Badge variant="outline">{kpiData.inProgress}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Resolved Today</span>
                  <Badge variant="outline">{kpiData.resolvedToday}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters Card */}
          {showFilters && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Status</h3>
                  <div className="space-y-2">
                    {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`status-${key}`}
                          checked={filters.status.includes(key as any)}
                          onChange={() => toggleFilter('status', key as any)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor={`status-${key}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Priority</h3>
                  <div className="space-y-2">
                    {Object.entries(PRIORITY_LABELS).map(([key, { label, color }]) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`priority-${key}`}
                          checked={filters.priority.includes(key as any)}
                          onChange={() => toggleFilter('priority', key as any)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`ml-2 text-sm px-2 py-0.5 rounded-full ${color} dark:bg-opacity-20`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Issue Type</h3>
                  <div className="space-y-2">
                    {[
                      { key: 'garbage', label: 'Garbage', icon: '🗑️' },
                      { key: 'pothole', label: 'Pothole', icon: '🕳️' },
                      { key: 'street_light', label: 'Street Light', icon: '💡' },
                      { key: 'water_leak', label: 'Water Leak', icon: '💧' },
                      { key: 'other', label: 'Other', icon: '❓' },
                    ].map(({ key, label, icon }) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`type-${key}`}
                          checked={filters.type.includes(key as any)}
                          onChange={() => toggleFilter('type', key as any)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor={`type-${key}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <span className="mr-2">{icon}</span>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Open Issues</p>
                <p className="text-2xl font-bold">
                  {issues.filter(i => i.status !== 'resolved').length}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/20">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Resolved Today</p>
                <p className="text-2xl font-bold">
                  {issues.filter(i => 
                    i.status === 'resolved' && 
                    new Date(i.reportedAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues List */}
      <div className="col-span-1">
        <Card>
          <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Issues</CardTitle>
              <p className="text-sm text-muted-foreground">
                {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'} found
              </p>
            </div>
            <div className="flex w-full space-x-2 sm:w-auto mt-2 sm:mt-0">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search issues..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-3"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Filters'}
              </Button>
              <Button 
                size="sm" 
                className="h-9"
                onClick={() => setIsCreatingIssue(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Issue
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredIssues.length > 0 ? (
              <div className="divide-y">
                {filteredIssues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{issue.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={`ml-2 ${STATUS_LABELS[issue.status].color}`}
                          >
                            {STATUS_LABELS[issue.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {issue.location.address}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={PRIORITY_LABELS[issue.priority].color}>
                          {PRIORITY_LABELS[issue.priority].label}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>Reported {new Date(issue.reportedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No issues found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setFilters({
                      status: ['new', 'in_progress', 'resolved'],
                      priority: ['low', 'medium', 'high', 'critical'],
                      type: ['garbage', 'pothole', 'street_light', 'water_leak', 'other']
                    })
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}