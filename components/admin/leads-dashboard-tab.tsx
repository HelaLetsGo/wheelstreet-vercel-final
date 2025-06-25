"use client"

import { useState, useEffect, useMemo } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2, TrendingUp, Users, AlertCircle, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, subDays, isAfter } from "date-fns"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Line } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement)

export default function LeadsDashboardTab() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setLeads(data || [])
    } catch (error) {
      console.error("Error fetching leads:", error)
      setError("Failed to load leads data")
    } finally {
      setLoading(false)
    }
  }

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    if (!leads.length) return null

    const now = new Date()
    const last7Days = subDays(now, 7)
    const last30Days = subDays(now, 30)

    const leadsLast7Days = leads.filter((lead) => isAfter(new Date(lead.created_at), last7Days))
    const leadsLast30Days = leads.filter((lead) => isAfter(new Date(lead.created_at), last30Days))

    // Interest counts
    const interestCounts = leads.reduce((acc, lead) => {
      const interest = lead.interest || "unknown"
      acc[interest] = (acc[interest] || 0) + 1
      return acc
    }, {})

    // Group by date for trend chart
    const leadsByDate = {}
    leads.forEach((lead) => {
      const date = format(new Date(lead.created_at), "yyyy-MM-dd")
      leadsByDate[date] = (leadsByDate[date] || 0) + 1
    })

    // Get last 14 days for trend chart
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = format(subDays(now, 13 - i), "yyyy-MM-dd")
      return {
        date,
        count: leadsByDate[date] || 0,
      }
    })

    return {
      total: leads.length,
      last7Days: leadsLast7Days.length,
      last30Days: leadsLast30Days.length,
      interestCounts,
      leadsByDate: last14Days,
    }
  }, [leads])

  // Prepare chart data
  const interestChartData = useMemo(() => {
    if (!metrics) return null

    const interestLabels = Object.keys(metrics.interestCounts)
    const interestData = interestLabels.map((label) => metrics.interestCounts[label])

    return {
      labels: interestLabels,
      datasets: [
        {
          label: "Leads by Interest",
          data: interestData,
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 159, 64, 0.8)",
            "rgba(199, 199, 199, 0.8)",
          ],
          borderWidth: 1,
        },
      ],
    }
  }, [metrics])

  const trendChartData = useMemo(() => {
    if (!metrics) return null

    return {
      labels: metrics.leadsByDate.map((item) => format(new Date(item.date), "MMM dd")),
      datasets: [
        {
          label: "New Leads",
          data: metrics.leadsByDate.map((item) => item.count),
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.3,
          fill: true,
        },
      ],
    }
  }, [metrics])

  const exportToCsv = () => {
    if (leads.length === 0) return

    const headers = ["Name", "Email", "Phone", "Interest", "Status", "Created At", "Notes"]
    const csvData = leads.map((lead) => [
      lead.name,
      lead.email || "",
      lead.phone,
      lead.interest || "",
      lead.status || "new",
      lead.created_at,
      lead.notes || "",
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `leads_${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
        <p className="text-white/70">{error}</p>
      </div>
    )
  }

  if (!leads.length) {
    return (
      <div className="p-6 text-center">
        <Users className="mx-auto h-12 w-12 text-white/40 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Leads Yet</h3>
        <p className="text-white/70">When visitors submit the contact form, their information will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Leads Dashboard</h2>
        <Button className="bg-white text-black hover:bg-white/90" onClick={exportToCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export All Leads
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">Total Leads</p>
                <h3 className="text-3xl font-bold text-white mt-1">{metrics?.total || 0}</h3>
              </div>
              <div className="rounded-full bg-blue-500/20 p-3">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">Last 7 Days</p>
                <h3 className="text-3xl font-bold text-white mt-1">{metrics?.last7Days || 0}</h3>
              </div>
              <div className="rounded-full bg-green-500/20 p-3">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card className="border-white/10 bg-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Lead Trend (Last 14 Days)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {trendChartData && (
            <div className="h-64">
              <Line
                data={trendChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: "rgba(255, 255, 255, 0.7)" },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                    x: {
                      ticks: { color: "rgba(255, 255, 255, 0.7)" },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: { color: "rgba(255, 255, 255, 0.7)" },
                    },
                  },
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Leads by Interest</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {interestChartData && (
            <div className="h-64">
              <Bar
                data={interestChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: "rgba(255, 255, 255, 0.7)" },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                    x: {
                      ticks: { color: "rgba(255, 255, 255, 0.7)" },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Leads */}
      <Card className="border-white/10 bg-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <h4 className="font-medium text-white">{lead.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-white/60 mt-1">
                    {lead.email && <span>{lead.email}</span>}
                    {lead.phone && <span>{lead.phone}</span>}
                  </div>
                  {lead.interest && (
                    <span className="inline-block mt-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      {lead.interest}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-white/60">{format(new Date(lead.created_at), "MMM dd, yyyy")}</span>
                  <div className="mt-1">
                    {lead.status === "new" && (
                      <span className="inline-block text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">New</span>
                    )}
                    {lead.status === "contacted" && (
                      <span className="inline-block text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                        Contacted
                      </span>
                    )}
                    {lead.status === "qualified" && (
                      <span className="inline-block text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        Qualified
                      </span>
                    )}
                    {lead.status === "closed" && (
                      <span className="inline-block text-xs bg-green-700/20 text-green-500 px-2 py-1 rounded">
                        Closed
                      </span>
                    )}
                    {lead.status === "rejected" && (
                      <span className="inline-block text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
