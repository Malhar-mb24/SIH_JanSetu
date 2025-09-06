"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Target, Users, Clock, ThumbsUp, Zap } from "lucide-react"
import type { AnalyticsMetric } from "@/lib/analytics-data"
import { getMetricChangeColor } from "@/lib/analytics-data"

interface MetricsOverviewProps {
  metrics: AnalyticsMetric[]
}

/**
 * Analytics Metrics Overview Component
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Implement real-time metric calculations with caching
 * - Add metric threshold alerts and notifications
 * - Implement custom metric definitions and formulas
 * - Add historical metric comparison and trending
 * - Consider implementing metric forecasting
 * - Add drill-down capabilities for detailed analysis
 * - Implement metric benchmarking against industry standards
 */
export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const getCategoryIcon = (category: AnalyticsMetric["category"]) => {
    const icons = {
      performance: <Target className="h-5 w-5" />,
      engagement: <Users className="h-5 w-5" />,
      efficiency: <Clock className="h-5 w-5" />,
      satisfaction: <ThumbsUp className="h-5 w-5" />,
    }
    return icons[category]
  }

  const getCategoryColor = (category: AnalyticsMetric["category"]) => {
    const colors = {
      performance: "text-blue-600",
      engagement: "text-green-600",
      efficiency: "text-purple-600",
      satisfaction: "text-orange-600",
    }
    return colors[category]
  }

  const getChangeIcon = (changeType: AnalyticsMetric["changeType"]) => {
    switch (changeType) {
      case "increase":
        return <TrendingUp className="h-4 w-4" />
      case "decrease":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === "%" || unit === "hours" || unit === "people") {
      return `${value.toLocaleString()}${unit === "%" ? "%" : ""}`
    }
    return value.toLocaleString()
  }

  const formatChange = (change: number, unit: string) => {
    const sign = change >= 0 ? "+" : ""
    if (unit === "%") {
      return `${sign}${change.toFixed(1)}%`
    }
    return `${sign}${change.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground">Key performance metrics and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">Live Data</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <div className={getCategoryColor(metric.category)}>{getCategoryIcon(metric.category)}</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{formatValue(metric.value, metric.unit)}</div>
                  {metric.unit !== "%" && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
                </div>

                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center gap-1 text-sm ${getMetricChangeColor(metric.changeType, metric.category)}`}
                  >
                    {getChangeIcon(metric.changeType)}
                    <span>{formatChange(metric.change, metric.unit)}</span>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {metric.category}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  Previous: {formatValue(metric.previousValue, metric.unit)}
                </div>

                {/* Progress bar for percentage metrics */}
                {metric.unit === "%" && (
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${Math.min(metric.value, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
