"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, FileText, Target } from "lucide-react"
import { MetricsOverview } from "@/components/analytics/metrics-overview"
import { PerformanceCharts } from "@/components/analytics/performance-charts"
import { ReportGenerator } from "@/components/analytics/report-generator"
import {
  fetchAnalyticsMetrics,
  fetchChartData,
  fetchReportTemplates,
  fetchPerformanceIndicators,
  type AnalyticsMetric,
  type ChartDataPoint,
  type ReportTemplate,
  type PerformanceIndicator,
} from "@/lib/analytics-data"

function AnalyticsContent() {
  const { user, logout } = useAuth()
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([])
  const [issueTrends, setIssueTrends] = useState<ChartDataPoint[]>([])
  const [responseTimeData, setResponseTimeData] = useState<ChartDataPoint[]>([])
  const [satisfactionData, setSatisfactionData] = useState<ChartDataPoint[]>([])
  const [departmentData, setDepartmentData] = useState<ChartDataPoint[]>([])
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([])
  const [performanceIndicators, setPerformanceIndicators] = useState<PerformanceIndicator[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const [
          metricsData,
          issueTrendsData,
          responseData,
          satisfactionDataResult,
          departmentDataResult,
          templatesData,
          indicatorsData,
        ] = await Promise.all([
          fetchAnalyticsMetrics(),
          fetchChartData("issue-trends"),
          fetchChartData("response-time"),
          fetchChartData("satisfaction"),
          fetchChartData("department-performance"),
          fetchReportTemplates(),
          fetchPerformanceIndicators(),
        ])

        setMetrics(metricsData)
        setIssueTrends(issueTrendsData)
        setResponseTimeData(responseData)
        setSatisfactionData(satisfactionDataResult)
        setDepartmentData(departmentDataResult)
        setReportTemplates(templatesData)
        setPerformanceIndicators(indicatorsData)
      } catch (error) {
        console.error("Failed to load analytics data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalyticsData()
  }, [])

  const handleGenerateReport = (templateId: string) => {
    console.log("Generating report for template:", templateId)
    // In real implementation, this would trigger report generation
  }

  const handleCreateTemplate = (template: Omit<ReportTemplate, "id" | "lastGenerated" | "nextScheduled">) => {
    const newTemplate: ReportTemplate = {
      ...template,
      id: Date.now().toString(),
      lastGenerated: new Date(),
      nextScheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    }
    setReportTemplates((prev) => [newTemplate, ...prev])
  }

  const handleUpdateTemplate = (templateId: string, updates: Partial<ReportTemplate>) => {
    setReportTemplates((prev) =>
      prev.map((template) => (template.id === templateId ? { ...template, ...updates } : template)),
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-2 bg-blue-600 rounded-lg">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reporting</h1>
          <p className="text-slate-600">
            Jharkhand Municipal Corporation - Performance insights and automated reporting
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="kpis" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            KPIs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <MetricsOverview metrics={metrics} />
        </TabsContent>

        <TabsContent value="charts" className="mt-6">
          <PerformanceCharts
            issueTrends={issueTrends}
            responseTimeData={responseTimeData}
            satisfactionData={satisfactionData}
            departmentData={departmentData}
          />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportGenerator
            templates={reportTemplates}
            onGenerateReport={handleGenerateReport}
            onCreateTemplate={handleCreateTemplate}
            onUpdateTemplate={handleUpdateTemplate}
          />
        </TabsContent>

        <TabsContent value="kpis" className="mt-6">
          <div className="text-center py-12">
            <Target className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold mb-2">KPI Dashboard</h3>
            <p className="text-slate-600">
              Key Performance Indicators dashboard coming soon with advanced tracking and alerts.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute requiredPermission="analytics.view">
      <DashboardLayout>
        <AnalyticsContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
