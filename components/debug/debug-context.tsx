"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type LogLevel = "info" | "warning" | "error" | "success"

export interface LogEntry {
  id: string
  timestamp: Date
  message: string
  level: LogLevel
  details?: any
}

interface DebugContextType {
  isDebugMode: boolean
  toggleDebugMode: () => void
  logs: LogEntry[]
  addLog: (message: string, level: LogLevel, details?: any) => void
  clearLogs: () => void
}

const DebugContext = createContext<DebugContextType>({
  isDebugMode: false,
  toggleDebugMode: () => {},
  logs: [],
  addLog: () => {},
  clearLogs: () => {},
})

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [isDebugMode, setIsDebugMode] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])

  // Load debug state from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedDebugMode = localStorage.getItem("wheelstreet_debug_mode")
        if (savedDebugMode) {
          setIsDebugMode(savedDebugMode === "true")
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  const toggleDebugMode = () => {
    try {
      const newMode = !isDebugMode
      setIsDebugMode(newMode)
      if (typeof window !== "undefined") {
        localStorage.setItem("wheelstreet_debug_mode", String(newMode))
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      setIsDebugMode(!isDebugMode) // Still toggle the state even if localStorage fails
    }
  }

  const addLog = (message: string, level: LogLevel, details?: any) => {
    try {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        message,
        level,
        details,
      }
      setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 100)) // Keep only the last 100 logs

      // Also log to console for easier debugging
      console.log(`[${level.toUpperCase()}] ${message}`, details || "")
    } catch (error) {
      console.error("Error adding log:", error)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <DebugContext.Provider value={{ isDebugMode, toggleDebugMode, logs, addLog, clearLogs }}>
      {children}
    </DebugContext.Provider>
  )
}

export function useDebug() {
  return useContext(DebugContext)
}
