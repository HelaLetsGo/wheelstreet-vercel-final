"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertTriangle, Check, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SqlQueryInterface() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [rowCount, setRowCount] = useState<number | null>(null)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const executeQuery = async () => {
    if (!query.trim()) {
      setError("Please enter a SQL query")
      return
    }

    setIsLoading(true)
    setError(null)
    setResults(null)
    setRowCount(null)
    setExecutionTime(null)

    const startTime = performance.now()

    try {
      // Execute the query
      const { data, error: queryError, count } = await supabase.rpc("execute_sql", { query_text: query })

      const endTime = performance.now()
      setExecutionTime(endTime - startTime)

      if (queryError) {
        throw queryError
      }

      setResults(data || [])
      setRowCount(count || (data ? data.length : 0))
    } catch (err) {
      console.error("Query execution error:", err)
      setError(err.message || "Failed to execute query")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get table headers from results
  const getTableHeaders = () => {
    if (!results || results.length === 0) return []
    return Object.keys(results[0])
  }

  // Function to export results as CSV
  const exportToCsv = () => {
    if (!results || results.length === 0) return

    const headers = getTableHeaders()
    const csvRows = [
      headers.join(","),
      ...results.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Handle null values and escape quotes
            const cellValue = value === null ? "" : String(value).replace(/"/g, '""')
            return `"${cellValue}"`
          })
          .join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `query_results_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">SQL Query Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              className="h-40 font-mono text-sm border-white/20 bg-zinc-900 text-white"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-xs text-white/60">
                <p>Use SELECT queries to retrieve data safely.</p>
                <p>Be careful with UPDATE, INSERT, or DELETE operations.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={executeQuery}
                  disabled={isLoading || !query.trim()}
                  className="bg-white text-black hover:bg-white/90 flex-1 sm:flex-none"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? "Executing..." : "Execute Query"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <Card className="border-white/10 bg-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <CardTitle className="text-white">Results</CardTitle>
              <div className="flex items-center gap-4">
                <div className="text-xs text-white/60">
                  {rowCount !== null && <span>{rowCount} rows</span>}
                  {executionTime !== null && <span className="ml-2">({executionTime.toFixed(2)}ms)</span>}
                </div>
                {results.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCsv}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Export CSV
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-zinc-900">
                      {getTableHeaders().map((header, index) => (
                        <th key={index} className="px-4 py-2 text-left text-xs font-medium text-white/70">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-white/10 hover:bg-zinc-700/30">
                        {getTableHeaders().map((header, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-xs text-white/90">
                            {row[header] !== null ? (
                              typeof row[header] === "object" ? (
                                JSON.stringify(row[header])
                              ) : (
                                String(row[header])
                              )
                            ) : (
                              <span className="text-white/40">NULL</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-white/60">
                <Check className="mr-2 h-4 w-4 text-green-400" />
                Query executed successfully. No results to display.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
