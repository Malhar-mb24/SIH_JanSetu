/**
 * Analytics and Reporting Data for Jansetu Municipal Dashboard
 *
 * This module provides mock data for analytics and reporting features.
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Replace with actual data warehouse queries and ETL processes
 * - Implement real-time analytics with streaming data processing
 * - Add data aggregation and caching for performance
 * - Implement automated report generation and scheduling
 * - Add data export functionality (PDF, Excel, CSV)
 * - Consider implementing predictive analytics and forecasting
 * - Add data visualization customization and dashboard builder
 * - Implement data retention policies and archiving
 */

export interface AnalyticsMetric {
  id: string
  name: string
  value: number
  previousValue: number
  change: number
  changeType: "increase" | "decrease" | "neutral"
  unit: string
  category: "performance" | "engagement" | "efficiency" | "satisfaction"
}

export interface ChartDataPoint {
  date: string
  value: number
  category?: string
  label?: string
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  category: "operational" | "performance" | "compliance" | "executive"
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annual"
  lastGenerated: Date
  nextScheduled: Date
  isActive: boolean
  recipients: string[]
  format: "pdf" | "excel" | "dashboard"
}

export interface PerformanceIndicator {
  id: string
  name: string
  current: number
  target: number
  unit: string
  status: "on-track" | "at-risk" | "critical"
  trend: "up" | "down" | "stable"
  category: string
}

// Mock Analytics Metrics
export const MOCK_ANALYTICS_METRICS: AnalyticsMetric[] = [
  {
    id: "1",
    name: "Issue Resolution Rate",
    value: 78,
    previousValue: 72,
    change: 8.3,
    changeType: "increase",
    unit: "%",
    category: "performance",
  },
  {
    id: "2",
    name: "Average Response Time",
    value: 4.2,
    previousValue: 5.1,
    change: -17.6,
    changeType: "decrease",
    unit: "hours",
    category: "efficiency",
  },
  {
    id: "3",
    name: "Citizen Satisfaction",
    value: 82,
    previousValue: 79,
    change: 3.8,
    changeType: "increase",
    unit: "%",
    category: "satisfaction",
  },
  {
    id: "4",
    name: "Community Event Attendance",
    value: 1247,
    previousValue: 1089,
    change: 14.5,
    changeType: "increase",
    unit: "people",
    category: "engagement",
  },
  {
    id: "5",
    name: "Volunteer Hours",
    value: 2340,
    previousValue: 2156,
    change: 8.5,
    changeType: "increase",
    unit: "hours",
    category: "engagement",
  },
  {
    id: "6",
    name: "Budget Utilization",
    value: 67,
    previousValue: 71,
    change: -5.6,
    changeType: "decrease",
    unit: "%",
    category: "efficiency",
  },
]

// Mock Chart Data
export const MOCK_ISSUE_TRENDS: ChartDataPoint[] = [
  { date: "2024-01-01", value: 45, category: "Infrastructure" },
  { date: "2024-01-02", value: 52, category: "Infrastructure" },
  { date: "2024-01-03", value: 38, category: "Infrastructure" },
  { date: "2024-01-04", value: 61, category: "Infrastructure" },
  { date: "2024-01-05", value: 43, category: "Infrastructure" },
  { date: "2024-01-06", value: 55, category: "Infrastructure" },
  { date: "2024-01-07", value: 49, category: "Infrastructure" },
  { date: "2024-01-01", value: 23, category: "Sanitation" },
  { date: "2024-01-02", value: 31, category: "Sanitation" },
  { date: "2024-01-03", value: 18, category: "Sanitation" },
  { date: "2024-01-04", value: 27, category: "Sanitation" },
  { date: "2024-01-05", value: 35, category: "Sanitation" },
  { date: "2024-01-06", value: 29, category: "Sanitation" },
  { date: "2024-01-07", value: 22, category: "Sanitation" },
]

export const MOCK_RESPONSE_TIME_DATA: ChartDataPoint[] = [
  { date: "Week 1", value: 5.2 },
  { date: "Week 2", value: 4.8 },
  { date: "Week 3", value: 4.5 },
  { date: "Week 4", value: 4.2 },
  { date: "Week 5", value: 3.9 },
  { date: "Week 6", value: 4.1 },
  { date: "Week 7", value: 3.8 },
  { date: "Week 8", value: 4.2 },
]

export const MOCK_SATISFACTION_DATA: ChartDataPoint[] = [
  { date: "Jan", value: 75 },
  { date: "Feb", value: 78 },
  { date: "Mar", value: 76 },
  { date: "Apr", value: 81 },
  { date: "May", value: 79 },
  { date: "Jun", value: 82 },
  { date: "Jul", value: 84 },
  { date: "Aug", value: 82 },
]

export const MOCK_DEPARTMENT_PERFORMANCE: ChartDataPoint[] = [
  { date: "Public Works", value: 85, label: "85%" },
  { date: "Sanitation", value: 78, label: "78%" },
  { date: "Utilities", value: 92, label: "92%" },
  { date: "Safety", value: 88, label: "88%" },
  { date: "Environment", value: 76, label: "76%" },
]

// Mock Report Templates
export const MOCK_REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "1",
    name: "Daily Operations Report",
    description: "Daily summary of issues, resolutions, and key metrics",
    category: "operational",
    frequency: "daily",
    lastGenerated: new Date("2024-01-16T08:00:00"),
    nextScheduled: new Date("2024-01-17T08:00:00"),
    isActive: true,
    recipients: ["admin@jansetu.gov", "manager@jansetu.gov"],
    format: "pdf",
  },
  {
    id: "2",
    name: "Weekly Performance Dashboard",
    description: "Comprehensive weekly performance metrics and trends",
    category: "performance",
    frequency: "weekly",
    lastGenerated: new Date("2024-01-15T09:00:00"),
    nextScheduled: new Date("2024-01-22T09:00:00"),
    isActive: true,
    recipients: ["admin@jansetu.gov"],
    format: "dashboard",
  },
  {
    id: "3",
    name: "Monthly Executive Summary",
    description: "High-level summary for executive leadership",
    category: "executive",
    frequency: "monthly",
    lastGenerated: new Date("2024-01-01T10:00:00"),
    nextScheduled: new Date("2024-02-01T10:00:00"),
    isActive: true,
    recipients: ["mayor@jansetu.gov", "admin@jansetu.gov"],
    format: "pdf",
  },
  {
    id: "4",
    name: "Compliance Audit Report",
    description: "Quarterly compliance and regulatory reporting",
    category: "compliance",
    frequency: "quarterly",
    lastGenerated: new Date("2024-01-01T14:00:00"),
    nextScheduled: new Date("2024-04-01T14:00:00"),
    isActive: true,
    recipients: ["compliance@jansetu.gov", "admin@jansetu.gov"],
    format: "excel",
  },
]

// Mock Performance Indicators
export const MOCK_PERFORMANCE_INDICATORS: PerformanceIndicator[] = [
  {
    id: "1",
    name: "Issue Resolution SLA",
    current: 78,
    target: 85,
    unit: "%",
    status: "at-risk",
    trend: "up",
    category: "Service Delivery",
  },
  {
    id: "2",
    name: "Citizen Response Rate",
    current: 92,
    target: 90,
    unit: "%",
    status: "on-track",
    trend: "up",
    category: "Engagement",
  },
  {
    id: "3",
    name: "Budget Variance",
    current: 5.2,
    target: 3.0,
    unit: "%",
    status: "critical",
    trend: "up",
    category: "Financial",
  },
  {
    id: "4",
    name: "Staff Utilization",
    current: 87,
    target: 85,
    unit: "%",
    status: "on-track",
    trend: "stable",
    category: "Operations",
  },
]

/**
 * API Functions - Replace with actual backend calls
 */

export async function fetchAnalyticsMetrics(): Promise<AnalyticsMetric[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_ANALYTICS_METRICS
}

export async function fetchChartData(type: string): Promise<ChartDataPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  switch (type) {
    case "issue-trends":
      return MOCK_ISSUE_TRENDS
    case "response-time":
      return MOCK_RESPONSE_TIME_DATA
    case "satisfaction":
      return MOCK_SATISFACTION_DATA
    case "department-performance":
      return MOCK_DEPARTMENT_PERFORMANCE
    default:
      return []
  }
}

export async function fetchReportTemplates(): Promise<ReportTemplate[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return MOCK_REPORT_TEMPLATES
}

export async function fetchPerformanceIndicators(): Promise<PerformanceIndicator[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_PERFORMANCE_INDICATORS
}

export function getMetricChangeColor(changeType: AnalyticsMetric["changeType"], category: string): string {
  if (changeType === "neutral") return "text-muted-foreground"

  // For efficiency metrics, decrease is good (like response time)
  if (category === "efficiency") {
    return changeType === "decrease" ? "text-green-600" : "text-red-600"
  }

  // For most other metrics, increase is good
  return changeType === "increase" ? "text-green-600" : "text-red-600"
}

export function getStatusColor(status: PerformanceIndicator["status"]): string {
  const colors = {
    "on-track": "bg-green-100 text-green-800",
    "at-risk": "bg-yellow-100 text-yellow-800",
    critical: "bg-red-100 text-red-800",
  }
  return colors[status]
}

export function getTrendIcon(trend: PerformanceIndicator["trend"]): string {
  const icons = {
    up: "↗️",
    down: "↘️",
    stable: "→",
  }
  return icons[trend]
}
