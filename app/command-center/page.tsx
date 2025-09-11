'use client'

import { GisCommandCenter } from '@/components/dashboard/gis-command-center'
import { useULB } from '@/contexts/ulb-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, MapPin } from 'lucide-react'

export default function CommandCenterPage() {
  const { currentULB } = useULB()

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">GIS Command Center</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and management of municipal issues
          </p>
        </div>
        
        {currentULB && (
          <Card className="w-full md:w-auto">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center space-x-2 text-sm font-medium">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>Current ULB</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{currentULB.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentULB.district}, {currentULB.state}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <GisCommandCenter />
    </div>
  )
}
