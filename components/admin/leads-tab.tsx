"use client"

import { useState, useEffect } from "react"
import {
  Download,
  Loader2,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  User,
  Tag,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Copy,
  Edit2,
  Users,
  Clock,
  FileText,
  MessageSquare,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/custom-dialog"
import { Textarea } from "@/components/ui/textarea"
import { format, isAfter, isBefore, formatDistanceToNow } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-compat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@supabase/supabase-js"

// Import the debug context
import { useDebug } from "@/components/debug/debug-context"

// Define lead status options
const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "blue" },
  { value: "contacted", label: "Contacted", color: "yellow" },
  { value: "qualified", label: "Qualified", color: "green" },
  { value: "closed", label: "Closed", color: "emerald" },
  { value: "rejected", label: "Rejected", color: "red" },
]

// Define lead interest options
const INTEREST_OPTIONS = [
  { value: "acquisition", label: "Automobilių įsigijimas" },
  { value: "financing", label: "Finansavimas" },
  { value: "insurance", label: "Draudimas" },
  { value: "ev", label: "Elektromobiliai" },
  { value: "other", label: "Kita paslauga" },
]

// Define time period options
const TIME_PERIOD_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "custom", label: "Custom Range" },
]

// Define team member type
interface TeamMember {
  id: string
  name: string
  position: string
  image_path?: string
  member_id: string
}

export default function LeadsTab() {
  const router = useRouter()
  const { addLog } = useDebug()

  // State for leads data and loading
  const [leads, setLeads] = useState<any[]>([])
  const [filteredLeads, setFilteredLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("")
  const [assignedTeamMember, setAssignedTeamMember] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState<any | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [bulkAction, setBulkAction] = useState<string | null>(null)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamMemberFilter, setTeamMemberFilter] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [isSaving, setIsSaving] = useState(false)

  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [interestFilter, setInterestFilter] = useState<string | null>(null)
  const [timePeriodFilter, setTimePeriodFilter] = useState("all")
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // State for sorting
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Create a Supabase client directly with the admin key for better permissions
  const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.ADMIN_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    addLog("Creating Supabase client", "info", {
      url: supabaseUrl,
      hasKey: !!supabaseKey,
      keyType: process.env.ADMIN_SECRET_KEY ? "admin" : "anon",
    })

    return createClient(supabaseUrl, supabaseKey)
  }

  // Fetch leads and team members on component mount
  useEffect(() => {
    fetchLeads()
    fetchTeamMembers()
  }, [])

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters()
  }, [
    leads,
    searchQuery,
    statusFilter,
    interestFilter,
    timePeriodFilter,
    customDateRange,
    sortField,
    sortDirection,
    teamMemberFilter,
  ])

  // Fetch leads from Supabase
  const fetchLeads = async () => {
    try {
      setLoading(true)
      addLog("Fetching leads", "info")

      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("leads").select("*")

      if (error) {
        addLog("Error fetching leads", "error", error)
        throw error
      }

      addLog("Leads fetched successfully", "success", { count: data?.length })
      setLeads(data || [])
    } catch (error) {
      console.error("Error fetching leads:", error)
      setError("Failed to load leads. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch team members from Supabase
  const fetchTeamMembers = async () => {
    try {
      addLog("Fetching team members", "info")

      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("team_members")
        .select("id, name, position, image_path, member_id")
        .order("name")

      if (error) {
        addLog("Error fetching team members", "error", error)
        throw error
      }

      addLog("Team members fetched successfully", "success", { count: data?.length })
      setTeamMembers(data || [])
    } catch (error) {
      console.error("Error fetching team members:", error)
    }
  }

  // Apply filters to leads
  const applyFilters = () => {
    let result = [...leads]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query) ||
          lead.phone?.toLowerCase().includes(query) ||
          lead.notes?.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((lead) => lead.status === statusFilter)
    }

    // Apply interest filter
    if (interestFilter) {
      result = result.filter((lead) => lead.interest === interestFilter)
    }

    // Apply team member filter
    if (teamMemberFilter) {
      result = result.filter((lead) => lead.team_member_id === teamMemberFilter)
    }

    // Apply time period filter
    if (timePeriodFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      switch (timePeriodFilter) {
        case "today":
          result = result.filter((lead) => isAfter(new Date(lead.created_at), today))
          break
        case "yesterday":
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          result = result.filter(
            (lead) => isAfter(new Date(lead.created_at), yesterday) && isBefore(new Date(lead.created_at), today),
          )
          break
        case "week":
          const weekStart = new Date(today)
          weekStart.setDate(weekStart.getDate() - weekStart.getDay())
          result = result.filter((lead) => isAfter(new Date(lead.created_at), weekStart))
          break
        case "month":
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
          result = result.filter((lead) => isAfter(new Date(lead.created_at), monthStart))
          break
        case "custom":
          if (customDateRange.start) {
            const startDate = new Date(customDateRange.start)
            result = result.filter((lead) => isAfter(new Date(lead.created_at), startDate))
          }
          if (customDateRange.end) {
            const endDate = new Date(customDateRange.end)
            endDate.setHours(23, 59, 59, 999)
            result = result.filter((lead) => isBefore(new Date(lead.created_at), endDate))
          }
          break
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA = a[sortField]
      let valueB = b[sortField]

      // Handle null values
      if (valueA === null) valueA = ""
      if (valueB === null) valueB = ""

      // Handle dates
      if (sortField === "created_at" || sortField === "updated_at") {
        valueA = new Date(valueA).getTime()
        valueB = new Date(valueB).getTime()
      }

      // Compare values
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    setFilteredLeads(result)
  }

  // Toggle sort direction or change sort field
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get status badge component
  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((option) => option.value === status) || STATUS_OPTIONS[0]

    const colorMap = {
      blue: "bg-blue-500/20 text-blue-300",
      yellow: "bg-yellow-500/20 text-yellow-300",
      green: "bg-green-500/20 text-green-300",
      emerald: "bg-green-700/20 text-green-500",
      red: "bg-red-500/20 text-red-300",
    }

    return (
      <Badge variant="outline" className={colorMap[statusOption.color]}>
        {statusOption.label}
      </Badge>
    )
  }

  // Get team member info
  const getTeamMemberInfo = (teamMemberId: string | null) => {
    if (!teamMemberId) return null
    return teamMembers.find((member) => member.id === teamMemberId)
  }

  // Open lead details dialog
  const openLeadDetails = async (lead: any) => {
    setSelectedLead(lead)
    setNotes(lead.notes || "")
    setStatus(lead.status || "new")
    setAssignedTeamMember(lead.team_member_id || null)
    setActiveTab("details")
    setIsDialogOpen(true)

    addLog("Opened lead details", "info", { leadId: lead.id, name: lead.name })
  }

  // Update lead - FIXED VERSION
  const updateLead = async () => {
    if (!selectedLead) return

    try {
      setIsSaving(true)
      addLog("Attempting to update lead", "info", {
        leadId: selectedLead.id,
        updates: {
          notes,
          status,
          team_member_id: assignedTeamMember,
        },
      })

      // Create a direct Supabase client with admin privileges
      const supabase = getSupabaseClient()

      // Prepare update data
      const updateData = {
        notes,
        status,
        team_member_id: assignedTeamMember,
        updated_at: new Date().toISOString(),
      }

      // Log the exact update operation
      addLog("Executing Supabase update", "info", {
        table: "leads",
        id: selectedLead.id,
        data: updateData,
      })

      // Perform the update
      const { data, error } = await supabase.from("leads").update(updateData).eq("id", selectedLead.id).select()

      if (error) {
        addLog("Error updating lead", "error", {
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })
        throw error
      }

      // Log the response data
      addLog("Lead update response", "success", { data })

      // Verify the update was successful
      if (!data || data.length === 0) {
        addLog("Lead update warning: No data returned", "warning", { leadId: selectedLead.id })
      }

      // Show success message
      setSuccessMessage("Lead updated successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)

      // Refresh leads
      fetchLeads()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error updating lead:", error)
      addLog("Error updating lead", "error", {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      setError("Failed to update lead. Please try again.")

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null)
      }, 3000)
    } finally {
      setIsSaving(false)
    }
  }

  // Delete lead
  const deleteLead = async () => {
    if (!leadToDelete) return

    try {
      setIsDeleteLoading(true)
      addLog("Attempting to delete lead", "info", { leadId: leadToDelete.id })

      const supabase = getSupabaseClient()
      const { error } = await supabase.from("leads").delete().eq("id", leadToDelete.id)

      if (error) {
        addLog("Error deleting lead", "error", error)
        throw error
      }

      addLog("Lead deleted successfully", "success", { leadId: leadToDelete.id })

      // Show success message
      setSuccessMessage("Lead deleted successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)

      // Refresh leads
      fetchLeads()
      setIsDeleteDialogOpen(false)
      setLeadToDelete(null)
    } catch (error) {
      console.error("Error deleting lead:", error)
      setError("Failed to delete lead. Please try again.")

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null)
      }, 3000)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  // Handle bulk action
  const handleBulkAction = async () => {
    if (!bulkAction || selectedLeads.length === 0) return

    try {
      setIsBulkActionLoading(true)
      addLog("Attempting bulk action", "info", { action: bulkAction, leadCount: selectedLeads.length })

      const supabase = getSupabaseClient()

      if (bulkAction === "delete") {
        // Delete selected leads
        const { error } = await supabase.from("leads").delete().in("id", selectedLeads)

        if (error) {
          addLog("Error performing bulk delete", "error", error)
          throw error
        }

        addLog("Bulk delete successful", "success", { count: selectedLeads.length })
        setSuccessMessage(`${selectedLeads.length} leads deleted successfully`)
      } else {
        // Update status for selected leads
        const { error } = await supabase
          .from("leads")
          .update({
            status: bulkAction,
            updated_at: new Date().toISOString(),
          })
          .in("id", selectedLeads)

        if (error) {
          addLog("Error performing bulk status update", "error", error)
          throw error
        }

        addLog("Bulk status update successful", "success", {
          count: selectedLeads.length,
          newStatus: bulkAction,
        })
        setSuccessMessage(`${selectedLeads.length} leads updated to ${bulkAction} status`)
      }

      // Reset selection
      setSelectedLeads([])
      setSelectAll(false)
      setBulkAction(null)

      // Refresh leads
      fetchLeads()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (error) {
      console.error("Error performing bulk action:", error)
      setError("Failed to perform bulk action. Please try again.")

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null)
      }, 3000)
    } finally {
      setIsBulkActionLoading(false)
    }
  }

  // Toggle select all leads
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map((lead) => lead.id))
    }
    setSelectAll(!selectAll)
  }

  // Toggle select individual lead
  const toggleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter((leadId) => leadId !== id))
    } else {
      setSelectedLeads([...selectedLeads, id])
    }
  }

  // Export leads to CSV
  const exportToCsv = () => {
    if (filteredLeads.length === 0) return

    try {
      addLog("Exporting leads to CSV", "info", { count: filteredLeads.length })

      const headers = ["Name", "Email", "Phone", "Interest", "Status", "Team Member", "Created At", "Notes"]
      const csvData = filteredLeads.map((lead) => {
        const teamMember = getTeamMemberInfo(lead.team_member_id)
        return [
          lead.name,
          lead.email || "",
          lead.phone,
          lead.interest || "",
          lead.status || "new",
          teamMember ? teamMember.name : "",
          lead.created_at,
          lead.notes || "",
        ]
      })

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

      addLog("CSV export completed", "success")
    } catch (error) {
      console.error("Error exporting to CSV:", error)
      addLog("Error exporting to CSV", "error", error)
      setError("Failed to export leads. Please try again.")
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter(null)
    setInterestFilter(null)
    setTeamMemberFilter(null)
    setTimePeriodFilter("all")
    setCustomDateRange({ start: "", end: "" })
    setIsFilterOpen(false)

    addLog("Filters reset", "info")
  }

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Show temporary success message
        setSuccessMessage("Copied to clipboard")
        setTimeout(() => setSuccessMessage(null), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
        addLog("Error copying to clipboard", "error", err)
      })
  }

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight">Leads Management</h2>
        <div className="flex gap-3 flex-wrap">
          <Button
            className="bg-white text-black hover:bg-white/90 shadow-sm"
            onClick={exportToCsv}
            disabled={filteredLeads.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 shadow-sm"
            onClick={() => fetchLeads()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <Alert className="border-green-500/30 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">{successMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <Input
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-white/20 bg-zinc-800/80 text-white h-10 shadow-sm"
          />
        </div>
        <Button
          variant="outline"
          className={`border-white/20 text-white hover:bg-white/10 ${isFilterOpen ? "bg-white/10" : ""} h-10 shadow-sm`}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {(statusFilter || interestFilter || teamMemberFilter || timePeriodFilter !== "all") && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {
                [statusFilter, interestFilter, teamMemberFilter, timePeriodFilter !== "all" ? 1 : null].filter(Boolean)
                  .length
              }
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="rounded-md border border-white/10 bg-zinc-800/95 p-5 mb-5 shadow-lg">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="status-filter" className="text-white/70 mb-2 block">
                Status
              </Label>
              <Select
                value={statusFilter || "default"}
                onValueChange={(value) => setStatusFilter(value === "default" ? null : value)}
              >
                <SelectTrigger className="border-white/20 bg-zinc-900 text-white">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-zinc-900 text-white">
                  <SelectItem value="default">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interest-filter" className="text-white/70 mb-2 block">
                Interest
              </Label>
              <Select
                value={interestFilter || "default"}
                onValueChange={(value) => setInterestFilter(value === "default" ? null : value)}
              >
                <SelectTrigger className="border-white/20 bg-zinc-900 text-white">
                  <SelectValue placeholder="All Interests" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-zinc-900 text-white">
                  <SelectItem value="default">All Interests</SelectItem>
                  {INTEREST_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="team-member-filter" className="text-white/70 mb-2 block">
                Team Member
              </Label>
              <Select
                value={teamMemberFilter || "default"}
                onValueChange={(value) => setTeamMemberFilter(value === "default" ? null : value)}
              >
                <SelectTrigger className="border-white/20 bg-zinc-900 text-white">
                  <SelectValue placeholder="All Team Members" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-zinc-900 text-white">
                  <SelectItem value="default">All Team Members</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="time-period-filter" className="text-white/70 mb-2 block">
                Time Period
              </Label>
              <Select value={timePeriodFilter} onValueChange={setTimePeriodFilter}>
                <SelectTrigger className="border-white/20 bg-zinc-900 text-white">
                  <SelectValue placeholder="Select Time Period" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-zinc-900 text-white">
                  {TIME_PERIOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {timePeriodFilter === "custom" && (
              <div className="sm:col-span-2">
                <Label className="text-white/70 mb-2 block">Custom Date Range</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                      className="border-white/20 bg-zinc-900 text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                      className="border-white/20 bg-zinc-900 text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 mr-2"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
            <Button className="bg-white text-black hover:bg-white/90" onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-md bg-zinc-800/95 border border-white/10 mb-4 shadow-md">
          <span className="text-white/70 text-sm ml-1">
            {selectedLeads.length} {selectedLeads.length === 1 ? "lead" : "leads"} selected
          </span>
          <div className="ml-auto flex gap-3">
            <Select value={bulkAction || "default"} onValueChange={setBulkAction}>
              <SelectTrigger className="border-white/20 bg-zinc-900 text-white w-40">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-zinc-900 text-white">
                <SelectItem value="default">Select Action</SelectItem>
                <SelectItem value="new">Mark as New</SelectItem>
                <SelectItem value="contacted">Mark as Contacted</SelectItem>
                <SelectItem value="qualified">Mark as Qualified</SelectItem>
                <SelectItem value="closed">Mark as Closed</SelectItem>
                <SelectItem value="rejected">Mark as Rejected</SelectItem>
                <SelectItem value="delete">Delete Selected</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-white text-black hover:bg-white/90"
              onClick={handleBulkAction}
              disabled={!bulkAction || bulkAction === "default" || isBulkActionLoading}
            >
              {isBulkActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Apply
            </Button>
          </div>
        </div>
      )}

      {filteredLeads.length === 0 ? (
        <div className="mt-8 text-center text-white/60 p-8 border border-white/10 rounded-md bg-zinc-800/80 shadow-inner">
          <AlertCircle className="mx-auto h-12 w-12 text-white/30 mb-4" />
          <p className="text-lg font-medium text-white mb-2">No leads found</p>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <div className="rounded-md border border-white/10 bg-zinc-800/90 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5 bg-zinc-900/50">
                  <TableHead className="w-[40px] text-white py-3">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                    />
                  </TableHead>
                  <TableHead className="text-white cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      Name
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                      {sortField !== "name" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-white">Contact</TableHead>
                  <TableHead className="text-white cursor-pointer" onClick={() => handleSort("interest")}>
                    <div className="flex items-center">
                      Interest
                      {sortField === "interest" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                      {sortField !== "interest" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-white cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Status
                      {sortField === "status" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                      {sortField !== "status" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-white">Assigned To</TableHead>
                  <TableHead className="text-white cursor-pointer" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center">
                      Date
                      {sortField === "created_at" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                      {sortField !== "created_at" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const teamMember = getTeamMemberInfo(lead.team_member_id)
                  return (
                    <TableRow key={lead.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleSelectLead(lead.id)}
                          className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-white">{lead.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm text-white/70">
                          {lead.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{lead.email}</span>
                              <button
                                onClick={() => copyToClipboard(lead.email)}
                                className="ml-1 text-white/50 hover:text-white"
                                title="Copy email"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3" />
                              <span>{lead.phone}</span>
                              <button
                                onClick={() => copyToClipboard(lead.phone)}
                                className="ml-1 text-white/50 hover:text-white"
                                title="Copy phone"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-white/70">
                        {lead.interest ? (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>
                              {INTEREST_OPTIONS.find((option) => option.value === lead.interest)?.label ||
                                lead.interest}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status || "new")}</TableCell>
                      <TableCell>
                        {teamMember ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={teamMember.image_path || "/team-placeholder.svg"} alt={teamMember.name} />
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                {getInitials(teamMember.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-white/80">{teamMember.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-white/50">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-white/70">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{lead.created_at && format(new Date(lead.created_at), "MMM dd, yyyy")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openLeadDetails(lead)}
                            className="h-8 px-2 py-1 text-blue-300 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 hover:text-blue-200"
                            title="Edit Lead"
                          >
                            <Edit2 className="mr-1 h-3.5 w-3.5" />
                            Edit
                          </Button>
                          {lead.phone && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`tel:${lead.phone}`, "_blank")}
                              className="h-8 w-8 p-0 text-white/70 hover:text-white"
                              title="Call"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setLeadToDelete(lead)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Lead Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
          <div className="sticky top-0 z-10 bg-zinc-900 border-b border-white/10 px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-xl">Lead Details</DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {selectedLead && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-white/50" />
                    <h3 className="text-lg font-semibold text-white">{selectedLead.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-white/50" />
                    <span className="text-sm text-white/70">
                      Created {formatDistanceToNow(new Date(selectedLead.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-zinc-800 border border-white/10 mb-6 w-full sm:w-auto">
                    <TabsTrigger value="details" className="data-[state=active]:bg-zinc-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="data-[state=active]:bg-zinc-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Notes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-0">
                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="rounded-md bg-zinc-800 p-5 border border-white/10">
                          <h4 className="mb-3 text-sm font-semibold text-white/70">Contact Information</h4>
                          <div className="space-y-3">
                            {selectedLead.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-white/50" />
                                <a
                                  href={`mailto:${selectedLead.email}`}
                                  className="text-white hover:underline break-all"
                                >
                                  {selectedLead.email}
                                </a>
                                <button
                                  onClick={() => copyToClipboard(selectedLead.email)}
                                  className="ml-1 text-white/50 hover:text-white flex-shrink-0"
                                  title="Copy email"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            {selectedLead.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-white/50" />
                                <a href={`tel:${selectedLead.phone}`} className="text-white hover:underline">
                                  {selectedLead.phone}
                                </a>
                                <button
                                  onClick={() => copyToClipboard(selectedLead.phone)}
                                  className="ml-1 text-white/50 hover:text-white flex-shrink-0"
                                  title="Copy phone"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="rounded-md bg-zinc-800 p-5 border border-white/10">
                          <h4 className="mb-3 text-sm font-semibold text-white/70">Lead Information</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-white/70">Status:</span>
                              {getStatusBadge(selectedLead.status || "new")}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/70">Interest:</span>
                              <span className="text-white">
                                {INTEREST_OPTIONS.find((option) => option.value === selectedLead.interest)?.label ||
                                  selectedLead.interest ||
                                  "-"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/70">Created:</span>
                              <span className="text-white">
                                {selectedLead.created_at &&
                                  format(new Date(selectedLead.created_at), "MMM dd, yyyy HH:mm")}
                              </span>
                            </div>
                            {selectedLead.updated_at && selectedLead.updated_at !== selectedLead.created_at && (
                              <div className="flex items-center justify-between">
                                <span className="text-white/70">Last Updated:</span>
                                <span className="text-white">
                                  {format(new Date(selectedLead.updated_at), "MMM dd, yyyy HH:mm")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="rounded-md bg-zinc-800 p-5 border border-white/10">
                          <h4 className="mb-3 text-sm font-semibold text-white/70">Quick Actions</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedLead.phone && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={() => window.open(`tel:${selectedLead.phone}`, "_blank")}
                              >
                                <Phone className="mr-1 h-3 w-3" />
                                Call
                              </Button>
                            )}
                            {selectedLead.email && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={() => window.open(`mailto:${selectedLead.email}`, "_blank")}
                              >
                                <Mail className="mr-1 h-3 w-3" />
                                Email
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="status" className="text-white/70 mb-2 block">
                            Status
                          </Label>
                          <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="border-white/20 bg-zinc-800 text-white">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="border-white/20 bg-zinc-800 text-white">
                              {STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="team_member" className="text-white/70 mb-2 block">
                            Assign Team Member
                          </Label>
                          <Select
                            value={assignedTeamMember || "unassigned"}
                            onValueChange={(value) => setAssignedTeamMember(value === "unassigned" ? null : value)}
                          >
                            <SelectTrigger className="border-white/20 bg-zinc-800 text-white">
                              <SelectValue placeholder="Select Team Member" />
                            </SelectTrigger>
                            <SelectContent className="border-white/20 bg-zinc-800 text-white">
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              {teamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name} - {member.position}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="rounded-md bg-zinc-800 p-5 border border-white/10">
                          <h4 className="mb-3 text-sm font-semibold text-white/70 flex items-center">
                            <UserCheck className="h-4 w-4 mr-2" />
                            Assigned Team Member
                          </h4>
                          {assignedTeamMember ? (
                            (() => {
                              const member = getTeamMemberInfo(assignedTeamMember)
                              if (!member) return <p className="text-white/50">Team member not found</p>

                              return (
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={member.image_path || "/team-placeholder.svg"} alt={member.name} />
                                    <AvatarFallback className="bg-primary/20 text-primary">
                                      {getInitials(member.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-white">{member.name}</p>
                                    <p className="text-sm text-white/70">{member.position}</p>
                                  </div>
                                </div>
                              )
                            })()
                          ) : (
                            <div className="flex items-center gap-2 text-white/50">
                              <Users className="h-4 w-4" />
                              <span>No team member assigned</span>
                            </div>
                          )}
                        </div>

                        <div className="rounded-md bg-zinc-800 p-5 border border-white/10">
                          <h4 className="mb-3 text-sm font-semibold text-white/70">Notes Preview</h4>
                          <div className="max-h-24 overflow-hidden relative">
                            {notes ? (
                              <p className="text-white/80 whitespace-pre-wrap">{notes}</p>
                            ) : (
                              <p className="text-white/50 italic">No notes added yet</p>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-800 to-transparent"></div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-white/70 hover:text-white"
                            onClick={() => setActiveTab("notes")}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            View full notes
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md bg-zinc-800 p-5 border border-white/10 mt-4">
                      <h4 className="mb-3 text-sm font-semibold text-white/70">Kliento žinutė</h4>
                      <div className="max-h-32 overflow-auto">
                        {selectedLead.message ? (
                          <p className="text-white/80 whitespace-pre-wrap">{selectedLead.message}</p>
                        ) : (
                          <p className="text-white/50 italic">Klientas nepaliko žinutės</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="notes" className="text-white/70 mb-2 block flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Lead Notes
                        </Label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add detailed notes about this lead here..."
                          className="h-80 border-white/20 bg-zinc-800 text-white font-mono text-sm p-4"
                        />
                        <p className="mt-2 text-xs text-white/50">
                          Add any important information about this lead, including conversation notes, follow-up
                          reminders, or special requirements.
                        </p>
                      </div>

                      <div className="rounded-md bg-zinc-800 p-5 border border-white/10">
                        <h4 className="mb-2 text-sm font-semibold text-white/70">Note Taking Tips</h4>
                        <ul className="space-y-1 text-sm text-white/70 list-disc pl-5">
                          <li>Include dates for each interaction</li>
                          <li>Note specific requirements or preferences</li>
                          <li>Record follow-up actions and deadlines</li>
                          <li>Document any pricing discussions or quotes</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 z-10 bg-zinc-900 border-t border-white/10 p-4 sm:p-6">
            <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={updateLead}
                className="bg-white text-black hover:bg-white/90 w-full sm:w-auto"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white max-w-md w-[95vw]">
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-white/80">Are you sure you want to delete this lead? This action cannot be undone.</p>

            {leadToDelete && (
              <div className="mt-4 rounded-md bg-zinc-800 p-4 border border-white/10">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-white/50" />
                  <h3 className="font-semibold text-white">{leadToDelete.name}</h3>
                </div>
                {leadToDelete.email && (
                  <div className="mt-2 text-sm text-white/70">
                    <Mail className="inline-block h-3 w-3 mr-1" />
                    <span className="break-all">{leadToDelete.email}</span>
                  </div>
                )}
                {leadToDelete.phone && (
                  <div className="mt-1 text-sm text-white/70">
                    <Phone className="inline-block h-3 w-3 mr-1" />
                    {leadToDelete.phone}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteLead}
              disabled={isDeleteLoading}
              className="bg-red-500 text-white hover:bg-red-600 w-full sm:w-auto"
            >
              {isDeleteLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
