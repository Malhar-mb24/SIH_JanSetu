"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FileText, Download, Calendar, Users, Play, Pause, Edit, Trash2 } from "lucide-react"
import type { ReportTemplate } from "@/lib/analytics-data"

interface ReportGeneratorProps {
  templates: ReportTemplate[]
  onGenerateReport: (templateId: string) => void
  onCreateTemplate: (template: Omit<ReportTemplate, "id" | "lastGenerated" | "nextScheduled">) => void
  onUpdateTemplate: (templateId: string, updates: Partial<ReportTemplate>) => void
}

/**
 * Report Generator Component
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Implement automated report generation with scheduling
 * - Add template customization with drag-and-drop builder
 * - Implement report delivery via email, FTP, or API
 * - Add report versioning and change tracking
 * - Implement conditional report generation based on thresholds
 * - Add report approval workflows for sensitive data
 * - Consider implementing report caching and optimization
 * - Add integration with external BI tools
 */
export function ReportGenerator({
  templates,
  onGenerateReport,
  onCreateTemplate,
  onUpdateTemplate,
}: ReportGeneratorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "operational" as ReportTemplate["category"],
    frequency: "weekly" as ReportTemplate["frequency"],
    recipients: [] as string[],
    format: "pdf" as ReportTemplate["format"],
    isActive: true,
  })
  const [recipientInput, setRecipientInput] = useState("")

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getCategoryColor = (category: ReportTemplate["category"]) => {
    const colors = {
      operational: "bg-blue-100 text-blue-800",
      performance: "bg-green-100 text-green-800",
      compliance: "bg-purple-100 text-purple-800",
      executive: "bg-orange-100 text-orange-800",
    }
    return colors[category]
  }

  const getFrequencyColor = (frequency: ReportTemplate["frequency"]) => {
    const colors = {
      daily: "bg-red-100 text-red-800",
      weekly: "bg-yellow-100 text-yellow-800",
      monthly: "bg-blue-100 text-blue-800",
      quarterly: "bg-green-100 text-green-800",
      annual: "bg-purple-100 text-purple-800",
    }
    return colors[frequency]
  }

  const handleAddRecipient = () => {
    if (recipientInput.trim() && !newTemplate.recipients.includes(recipientInput.trim())) {
      setNewTemplate({
        ...newTemplate,
        recipients: [...newTemplate.recipients, recipientInput.trim()],
      })
      setRecipientInput("")
    }
  }

  const handleRemoveRecipient = (email: string) => {
    setNewTemplate({
      ...newTemplate,
      recipients: newTemplate.recipients.filter((r) => r !== email),
    })
  }

  const handleCreateTemplate = () => {
    if (newTemplate.name.trim() && newTemplate.description.trim()) {
      onCreateTemplate(newTemplate)
      setNewTemplate({
        name: "",
        description: "",
        category: "operational",
        frequency: "weekly",
        recipients: [],
        format: "pdf",
        isActive: true,
      })
      setShowCreateForm(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Report Generator</h2>
          <p className="text-muted-foreground">Create, schedule, and manage automated reports</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <FileText className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Create Template Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Report Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="Enter template name..."
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) =>
                    setNewTemplate({ ...newTemplate, category: value as ReportTemplate["category"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this report includes..."
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newTemplate.frequency}
                  onValueChange={(value) =>
                    setNewTemplate({ ...newTemplate, frequency: value as ReportTemplate["frequency"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <Select
                  value={newTemplate.format}
                  onValueChange={(value) =>
                    setNewTemplate({ ...newTemplate, format: value as ReportTemplate["format"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="dashboard">Interactive Dashboard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Recipients</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Enter email address..."
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddRecipient()}
                />
                <Button onClick={handleAddRecipient}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newTemplate.recipients.map((email) => (
                  <Badge
                    key={email}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveRecipient(email)}
                  >
                    {email} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={newTemplate.isActive}
                onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, isActive: checked })}
              />
              <Label htmlFor="active">Active Template</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateTemplate}>Create Template</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Templates */}
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className={`${!template.isActive ? "opacity-60" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                    <Badge className={getFrequencyColor(template.frequency)}>{template.frequency}</Badge>
                    <Badge variant="outline">{template.format.toUpperCase()}</Badge>
                    {!template.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </div>

                  <p className="text-muted-foreground mb-3">{template.description}</p>

                  <div className="grid gap-3 md:grid-cols-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Last: {formatDate(template.lastGenerated)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Next: {formatDate(template.nextScheduled)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{template.recipients.length} recipients</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.recipients.slice(0, 3).map((email) => (
                      <Badge key={email} variant="outline" className="text-xs">
                        {email}
                      </Badge>
                    ))}
                    {template.recipients.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.recipients.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => onGenerateReport(template.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateTemplate(template.id, { isActive: !template.isActive })}
                  >
                    {template.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No report templates</h3>
            <p className="text-muted-foreground mb-4">Create your first automated report template to get started.</p>
            <Button onClick={() => setShowCreateForm(true)}>Create Template</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
