'use client'

import { Clock, AlertTriangle, CheckCircle2, Hourglass } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface SLAMonitorProps {
  reportedAt: string
  slaDeadline: string
  status: 'new' | 'in_progress' | 'resolved' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  className?: string
}

export function SLAMonitor({ reportedAt, slaDeadline, status, priority, className }: SLAMonitorProps) {
  const now = new Date()
  const reportedDate = new Date(reportedAt)
  const deadlineDate = new Date(slaDeadline)
  const totalHours = Math.ceil((deadlineDate.getTime() - reportedDate.getTime()) / (1000 * 60 * 60))
  const hoursRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60))
  const isOverdue = now > deadlineDate && status !== 'resolved'
  const isUrgent = hoursRemaining <= 2 && !isOverdue
  
  // Calculate progress percentage (0-100)
  const progress = Math.max(0, Math.min(100, 
    ((now.getTime() - reportedDate.getTime()) / 
    (deadlineDate.getTime() - reportedDate.getTime())) * 100
  ))

  // Priority-based SLA thresholds (in hours)
  const priorityThresholds = {
    critical: 2,
    high: 4,
    medium: 12,
    low: 24
  }

  // Determine status based on SLA
  const getSLAStatus = () => {
    if (status === 'resolved') return 'resolved'
    if (isOverdue) return 'overdue'
    if (hoursRemaining <= priorityThresholds[priority]) return 'at_risk'
    return 'on_track'
  }

  const slaStatus = getSLAStatus()
  
  // Status configurations
  const statusConfig = {
    on_track: {
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'On track',
      progress: 'bg-blue-500',
    },
    at_risk: {
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      text: 'At risk',
      progress: 'bg-amber-500',
    },
    overdue: {
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/30',
      text: 'Overdue',
      progress: 'bg-red-500',
    },
    resolved: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/30',
      text: 'Resolved',
      progress: 'bg-green-500',
    },
  }

  const { icon: StatusIcon, color, bg, text, progress: progressColor } = statusConfig[slaStatus]
  
  // Format time remaining
  const formatTimeRemaining = () => {
    if (status === 'resolved') return 'Resolved'
    if (isOverdue) {
      const hoursOverdue = Math.ceil((now.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60))
      return `${hoursOverdue}h overdue`
    }
    if (hoursRemaining < 1) {
      const minutesRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60))
      return `${minutesRemaining}m remaining`
    }
    return `${hoursRemaining}h remaining`
  }

  // Format deadline date
  const formatDeadline = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  // Priority badge
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

  return (
    <div className={cn('rounded-lg p-4', bg, className)}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-medium mb-1">SLA Status</h4>
          <div className="flex items-center space-x-2">
            <StatusIcon className={cn('h-4 w-4', color)} />
            <span className="text-sm font-medium">{text}</span>
          </div>
        </div>
        
        <Badge className={priorityBadge[priority].className}>
          {priorityBadge[priority].label}
        </Badge>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Time remaining</span>
          <span className={cn('font-medium', {
            'text-red-600 dark:text-red-400': isOverdue,
            'text-amber-600 dark:text-amber-400': isUrgent && !isOverdue,
          })}>
            {formatTimeRemaining()}
          </span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Progress 
                  value={progress} 
                  className={cn('h-2', progressColor)}
                  indicatorClassName={progressColor}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Reported:</span>
                  <span className="text-xs font-medium">
                    {formatDeadline(reportedDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Deadline:</span>
                  <span className="text-xs font-medium">
                    {formatDeadline(deadlineDate)}
                  </span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </Tooltip>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Reported {new Date(reportedAt).toLocaleDateString()}</span>
          <span>Due {formatDeadline(deadlineDate)}</span>
        </div>
      </div>
      
      {isUrgent && !isOverdue && (
        <div className="mt-3 flex items-center space-x-2 rounded-md bg-amber-100 p-2 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <p className="text-xs">
            {priority === 'critical' 
              ? 'Critical priority: Immediate attention required' 
              : 'Approaching deadline: Please take action soon'}
          </p>
        </div>
      )}
    </div>
  )
}
