"use client"

import { useState } from "react"
import { useDebug } from "./debug-context"
import { X, Bug, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DebugPanel() {
  const { logs, clearLogs, isEnabled, setIsEnabled } = useDebug()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)

  // Toggle debug mode
  const toggleDebugMode = () => {
    setIsEnabled(!isEnabled)
  }

  // Toggle panel open/closed
  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  // Toggle collapsed state
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Get icon for log level
  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
      default:
        return <Info className="h-4 w-4 text-blue-400 flex-shrink-0" />
    }
  }

  // Get background color for log level
  const getLogBackground = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-500/10 border-red-500/30"
      case "success":
        return "bg-green-500/10 border-green-500/30"
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30"
      default:
        return "bg-blue-500/10 border-blue-500/30"
    }
  }

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
  }

  // If debug mode is not enabled, don't render anything
  if (!isEnabled) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col rounded-lg border border-white/10 bg-zinc-900 shadow-lg transition-all duration-300",
        isOpen ? "w-[90vw] max-w-3xl" : "w-auto",
        isCollapsed && isOpen ? "h-12" : isOpen ? "h-[50vh]" : "h-12",
      )}
    >
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-white" />
          <h3 className="font-medium text-white">Debug Console</h3>
          {!isOpen && logs.length > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {logs.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              onClick={toggleCollapsed}
              className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={togglePanel}
            className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
            title={isOpen ? "Close" : "Open"}
          >
            {isOpen ? <X className="h-4 w-4" /> : <span className="text-xs">Open</span>}
          </button>
        </div>
      </div>

      {/* Content */}
      {isOpen && !isCollapsed && (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            {logs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-white/50">
                <p>No logs to display. Actions will be logged here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className={cn("rounded-md border p-3 text-sm", getLogBackground(log.level))}>
                    <div className="flex items-start gap-2">
                      {getLogIcon(log.level)}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white">{log.message}</p>
                          <span className="text-xs text-white/50">{formatTime(log.timestamp)}</span>
                        </div>
                        {log.details && (
                          <pre className="mt-2 max-h-32 overflow-auto rounded bg-black/30 p-2 text-xs text-white/70">
                            {typeof log.details === "string" ? log.details : JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/10 p-2">
            <button
              onClick={clearLogs}
              className="rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white"
              disabled={logs.length === 0}
            >
              Clear Logs
            </button>
            <button
              onClick={toggleDebugMode}
              className="rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white"
            >
              Disable Debug Mode
            </button>
          </div>
        </>
      )}
    </div>
  )
}
