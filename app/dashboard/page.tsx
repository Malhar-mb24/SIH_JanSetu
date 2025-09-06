"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchKPIData, type KPIData } from "@/lib/mock-data"
import { BarChart3, FileText, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react"

function DashboardContent() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const kpiDataResult = await fetchKPIData()
        setKpiData(kpiDataResult)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Jharkhand Municipal Corporation Dashboard</h1>
        <p className="text-slate-600 mt-1">Digital governance operations summary and key performance indicators</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Issues</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{kpiData?.totalIssues || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Citizen reported issues</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Issues</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{kpiData?.pendingIssues || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting resolution</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Resolved Issues</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{kpiData?.resolvedIssues || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Successfully completed</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{kpiData?.activeStaff || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Currently online</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
          <CardDescription>Common municipal administration tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <FileText className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-slate-900">Citizen Issues</h3>
              <p className="text-sm text-slate-600">Manage citizen complaints</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <BarChart3 className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-medium text-slate-900">Performance Reports</h3>
              <p className="text-sm text-slate-600">Municipal analytics</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <Users className="h-6 w-6 text-purple-600 mb-2" />
              <h3 className="font-medium text-slate-900">Community Programs</h3>
              <p className="text-sm text-slate-600">Citizen engagement</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <AlertTriangle className="h-6 w-6 text-red-600 mb-2" />
              <h3 className="font-medium text-slate-900">Emergency Issues</h3>
              <p className="text-sm text-slate-600">High priority items</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jharkhand-specific integration placeholder section */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Jharkhand Government Integrations</CardTitle>
          <CardDescription>Ready for integration with state government systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-semibold">JH</span>
              </div>
              <h3 className="font-medium text-slate-900">Jharkhand Portal</h3>
              <p className="text-sm text-slate-600">State government integration</p>
            </div>
            <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-semibold">AA</span>
              </div>
              <h3 className="font-medium text-slate-900">Aadhaar Services</h3>
              <p className="text-sm text-slate-600">Citizen authentication</p>
            </div>
            <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-semibold">DG</span>
              </div>
              <h3 className="font-medium text-slate-900">Digital India</h3>
              <p className="text-sm text-slate-600">National programs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredPermission="dashboard.view">
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
