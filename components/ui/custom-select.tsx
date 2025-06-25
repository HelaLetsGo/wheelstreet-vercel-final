"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: { value: string; label: string }[]
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, options, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full appearance-none border border-white/20 bg-zinc-900 px-3 py-2 pr-8 text-sm text-white focus-visible:outline-none focus-visible:border-white/40 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  )
})
Select.displayName = "Select"

export { Select }
