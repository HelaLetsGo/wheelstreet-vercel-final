"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

export function SimpleTabs({ defaultValue, value, onValueChange, children, className, ...props }: TabsProps) {
  const [tabValue, setTabValue] = React.useState(value || defaultValue)

  React.useEffect(() => {
    if (value !== undefined) {
      setTabValue(value)
    }
  }, [value])

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setTabValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [onValueChange, value],
  )

  return (
    <TabsContext.Provider value={{ value: tabValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function SimpleTabsList({ children, className, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function SimpleTabsTrigger({ value, children, className, disabled = false, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)

  if (!context) {
    throw new Error("SimpleTabsTrigger must be used within SimpleTabs")
  }

  const isSelected = context.value === value

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      disabled={disabled}
      data-state={isSelected ? "active" : "inactive"}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function SimpleTabsContent({ value, children, className, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext)

  if (!context) {
    throw new Error("SimpleTabsContent must be used within SimpleTabs")
  }

  const isSelected = context.value === value

  if (!isSelected) {
    return null
  }

  return (
    <div
      role="tabpanel"
      data-state={isSelected ? "active" : "inactive"}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  SimpleTabs as Tabs,
  SimpleTabsList as TabsList,
  SimpleTabsTrigger as TabsTrigger,
  SimpleTabsContent as TabsContent,
}
