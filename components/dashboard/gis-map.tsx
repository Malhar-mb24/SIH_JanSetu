"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Filter, Layers, ZoomIn } from "lucide-react"
import type { Issue } from "@/lib/mock-data"
import { getPriorityColor, getCategoryIcon } from "@/lib/mock-data"

interface GISMapProps {
  issues: Issue[]
}

/**
 * GIS Map Component
 *
 * BACKEND IMPLEMENTATION NOTES:
 * - Integrate with mapping service (Google Maps, Mapbox, OpenStreetMap)
 * - Implement real-time location tracking for field agents
 * - Add geofencing for automatic issue assignment
 * - Implement clustering for dense issue areas
 * - Add route optimization for field teams
 * - Consider offline map capabilities for field use
 */
export function GISMap({ issues }: GISMapProps) {
  const criticalIssues = issues.filter((issue) => issue.priority === "critical")
  const openIssues = issues.filter((issue) => issue.status === "open")

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Live Issue Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-2" />
              Layers
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mock Map Interface */}
        <div className="relative bg-muted rounded-lg h-96 overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
            {/* Grid Pattern to simulate map */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>

          {/* Issue Markers */}
          <div className="absolute inset-0 p-4">
            {issues.map((issue, index) => (
              <div
                key={issue.id}
                className="absolute cursor-pointer group"
                style={{
                  left: `${20 + ((index * 15) % 60)}%`,
                  top: `${20 + ((index * 20) % 60)}%`,
                }}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs ${
                    issue.priority === "critical"
                      ? "bg-red-500"
                      : issue.priority === "high"
                        ? "bg-orange-500"
                        : issue.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                  }`}
                >
                  {getCategoryIcon(issue.category)}
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white p-3 rounded-lg shadow-lg border min-w-48">
                    <h4 className="font-medium text-sm">{issue.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{issue.location.address}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-xs ${getPriorityColor(issue.priority)}`}>{issue.priority}</Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
              <ZoomIn className="h-4 w-4 rotate-180" />
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
            <h4 className="font-medium text-sm mb-2">Issue Priority</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Critical ({criticalIssues.length})</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between mt-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold">{issues.length}</div>
            <div className="text-xs text-muted-foreground">Total Issues</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{criticalIssues.length}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{openIssues.length}</div>
            <div className="text-xs text-muted-foreground">Open</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {issues.filter((i) => i.status === "resolved").length}
            </div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
