"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import type { KPIData } from "@/lib/mock-data"

interface KPICardsProps {
  data: KPIData
}

export function KPICards({ data }: KPICardsProps) {
  const resolutionRate = Math.round((data.resolvedIssues / data.totalIssues) * 100)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalIssues}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {data.pendingIssues} pending
            </Badge>
            <Badge variant="outline" className="text-xs">
              {data.criticalIssues} critical
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolutionRate}%</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span>
              {data.resolvedIssues} of {data.totalIssues} resolved
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.avgResolutionTime}h</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <TrendingDown className="h-3 w-3 text-green-600" />
            <span>12% faster than last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Citizen Satisfaction</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.citizenSatisfaction}%</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span>Based on 234 responses</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{data.criticalIssues}</div>
          <div className="text-xs text-muted-foreground mt-2">Require immediate attention</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{data.pendingIssues}</div>
          <div className="text-xs text-muted-foreground mt-2">Awaiting assignment or action</div>
        </CardContent>
      </Card>
    </div>
  )
}
