'use client'

import { useULB } from '@/contexts/ulb-context'
import { ChevronsUpDown, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function ULBSelector() {
  const { currentULB, availableULBs, setCurrentULB, isSuperAdmin, isLoading } = useULB()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-[250px] justify-between">
        <div className="flex items-center">
          <Building2 className="mr-2 h-4 w-4 animate-pulse" />
          <span>Loading ULBs...</span>
        </div>
      </Button>
    )
  }

  if (availableULBs.length === 0) {
    return (
      <Button variant="outline" disabled className="w-[250px] justify-between">
        <div className="flex items-center">
          <Building2 className="mr-2 h-4 w-4" />
          <span>No ULBs available</span>
        </div>
      </Button>
    )
  }

  // Get filtered ULBs based on user role
  const filteredULBs = isSuperAdmin 
    ? [...availableULBs] 
    : availableULBs.filter(ulb => ulb.id === currentULB?.id)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          <div className="flex items-center truncate">
            <Building2 className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {currentULB ? currentULB.name : 'Select ULB...'}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command>
          <CommandInput placeholder="Search ULB by name or district..." />
          <CommandEmpty>No ULB found. Try a different search term.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {filteredULBs
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((ulb) => (
              <CommandItem
                key={ulb.id}
                value={ulb.name}
                onSelect={() => {
                  setCurrentULB(ulb)
                  setOpen(false)
                }}
                className={cn(
                  'flex flex-col items-start gap-1',
                  currentULB?.id === ulb.id ? 'bg-accent/20' : ''
                )}
              >
                <div className="flex items-center">
                  <Building2
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentULB?.id === ulb.id ? 'opacity-100' : 'opacity-40'
                    )}
                  />
                  <span className="font-medium">{ulb.name}</span>
                </div>
                <div className="ml-6 text-xs text-muted-foreground">
                  {ulb.district}, {ulb.state}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
