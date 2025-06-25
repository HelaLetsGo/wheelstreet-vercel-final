"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  Download,
  RefreshCw,
  Eye,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  X,
  Save,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/custom-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTeamMemberImagePath } from "@/lib/image-utils"

interface Lead {
  id: string
  name: string
  email: string | null
  phone: string
  interest: string | null
  status: string
  notes: string | null
  message: string | null
  team_member_id: string | null
  created_at: string
  updated_at: string
}

interface TeamMember {
  id: string
  name: string
  position: string
  member_id: string
  image_path?: string
}

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-blue-500/20 border-blue-500/30", textColor: "text-blue-300", icon: "🆕" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-500/20 border-yellow-500/30", textColor: "text-yellow-300", icon: "📞" },
  { value: "qualified", label: "Qualified", color: "bg-green-500/20 border-green-500/30", textColor: "text-green-300", icon: "✅" },
  { value: "proposal", label: "Proposal", color: "bg-purple-500/20 border-purple-500/30", textColor: "text-purple-300", icon: "📋" },
  { value: "negotiating", label: "Negotiating", color: "bg-orange-500/20 border-orange-500/30", textColor: "text-orange-300", icon: "🤝" },
  { value: "won", label: "Won", color: "bg-emerald-500/20 border-emerald-500/30", textColor: "text-emerald-300", icon: "🎉" },
  { value: "lost", label: "Lost", color: "bg-red-500/20 border-red-500/30", textColor: "text-red-300", icon: "❌" },
  { value: "rejected", label: "Rejected", color: "bg-gray-500/20 border-gray-500/30", textColor: "text-gray-300", icon: "🚫" },
]


const INTEREST_OPTIONS = [
  { value: "acquisition", label: "Acquisition", icon: "🚗" },
  { value: "financing", label: "Financing", icon: "💰" },
  { value: "insurance", label: "Insurance", icon: "🛡️" },
  { value: "Pardavimas", label: "Pardavimas", icon: "💸" },
  { value: "other", label: "Other", icon: "🔧" },
]

export default function EnhancedLeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    status: "new",
    notes: "",
    message: "",
    team_member_id: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/debug/team-members')
      if (!response.ok) throw new Error('Failed to fetch data')
      
      const data = await response.json()
      setLeads(data.leads || [])
      setTeamMembers(data.teamMembers || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const openLeadDialog = (lead?: Lead) => {
    if (lead) {
      setSelectedLead(lead)
      setFormData({
        name: lead.name,
        email: lead.email || "",
        phone: lead.phone,
        interest: lead.interest || "",
        status: lead.status,
        notes: lead.notes || "",
        message: lead.message || "",
        team_member_id: lead.team_member_id || ""
      })
    } else {
      setSelectedLead(null)
      setFormData({
        name: "",
        email: "",
        phone: "",
        interest: "",
        status: "new",
        notes: "",
        message: "",
        team_member_id: ""
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)

      if (!selectedLead) {
        setError('No lead selected for updating')
        return
      }

      // Update notes, status, and team member assignment
      const updatePayload = {
        notes: formData.notes,
        status: formData.status,
        team_member_id: formData.team_member_id || null
      }

      const url = `/api/leads/${selectedLead.id}`
      console.log('Updating lead:', { leadId: selectedLead.id, payload: updatePayload })

      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      })

      const responseData = await response.json().catch(() => ({ error: 'Invalid JSON response' }))
      console.log('Response:', { status: response.status, data: responseData })

      if (!response.ok) {
        const errorMessage = responseData.error || responseData.details || `Failed to update notes (${response.status})`
        console.error('API Error Details:', { status: response.status, responseData })
        throw new Error(errorMessage)
      }

      setSuccess('Lead updated successfully')
      setIsDialogOpen(false)
      fetchData() // Refresh the data to show updated notes
    } catch (err) {
      console.error('Error updating notes:', err)
      setError(err instanceof Error ? err.message : 'Failed to update notes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return

    try {
      setError(null)
      
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete lead')
      }

      setSuccess('Lead deleted successfully')
      fetchData()
    } catch (err) {
      console.error('Error deleting lead:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete lead')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
    return (
      <Badge className={`${statusOption.color} ${statusOption.textColor} text-xs border inline-flex items-center gap-1 whitespace-nowrap`}>
        <span>{statusOption.icon}</span>
        <span>{statusOption.label}</span>
      </Badge>
    )
  }

  const getTeamMemberInfo = (teamMemberId: string | null) => {
    if (!teamMemberId) return null
    return teamMembers.find(member => member.id === teamMemberId)
  }

  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${type} copied to clipboard!`)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      toast.error(`Failed to copy ${type}`)
    }
  }


  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.phone.includes(searchQuery)
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Interest', 'Status', 'Message', 'Notes', 'Created'],
      ...filteredLeads.map(lead => [
        lead.name,
        lead.email || '',
        lead.phone,
        lead.interest || '',
        lead.status,
        lead.message || '',
        lead.notes || '',
        format(new Date(lead.created_at), 'yyyy-MM-dd')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Sales Pipeline</h2>
          <p className="text-white/70">Manage leads and track sales progress</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchData} variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={exportLeads} variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => openLeadDialog()} className="bg-white text-black hover:bg-white/90">
            <User className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500/30 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">{success}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="border-white/10 bg-zinc-800/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                placeholder="Search leads by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-white/20 bg-zinc-800 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 border-white/20 bg-zinc-800 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-zinc-800 text-white">
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.icon} {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-zinc-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-white/60">Total Leads</p>
                <p className="text-xl font-bold text-white">{leads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-zinc-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-white/60">New Leads</p>
                <p className="text-xl font-bold text-white">
                  {leads.filter(l => l.status === 'new').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-zinc-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-white/60">Won</p>
                <p className="text-xl font-bold text-white">
                  {leads.filter(l => l.status === 'won').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-zinc-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm text-white/60">In Progress</p>
                <p className="text-xl font-bold text-white">
                  {leads.filter(l => ['contacted', 'qualified', 'proposal', 'negotiating'].includes(l.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="border-white/10 bg-zinc-800/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Contact</TableHead>
                <TableHead className="text-white">Interest</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Assigned To</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => {
                const teamMember = getTeamMemberInfo(lead.team_member_id)
                return (
                  <TableRow key={lead.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">{lead.name}</TableCell>
                    <TableCell className="text-white/70">
                      <div className="space-y-1">
                        {lead.email && (
                          <div className="flex items-center gap-1 text-xs">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/70">
                      {lead.interest && (
                        <Badge variant="outline" className="text-xs border-white/20 text-white/80 inline-flex items-center gap-1 whitespace-nowrap">
                          <span>{INTEREST_OPTIONS.find(i => i.value === lead.interest)?.icon || "🔧"}</span>
                          <span>{INTEREST_OPTIONS.find(i => i.value === lead.interest)?.label || lead.interest}</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>
                      {teamMember ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={formatTeamMemberImagePath(teamMember.image_path)} alt={teamMember.name} />
                            <AvatarFallback className="bg-blue-500/20 text-blue-300 text-xs font-medium">
                              {getInitials(teamMember.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-white truncate">{teamMember.name}</div>
                            <div className="text-xs text-white/60 truncate">{teamMember.position}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-white/50">
                          <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <span className="text-sm">Unassigned</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {format(new Date(lead.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          onClick={() => openLeadDialog(lead)}
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {lead.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-white/20 hover:bg-white/10"
                            onClick={() => copyToClipboard(lead.email, 'Email')}
                            title="Copy email"
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-white/20 hover:bg-white/10"
                          onClick={() => window.open(`tel:${lead.phone}`)}
                          title="Call phone"
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDelete(lead.id)}
                          title="Delete lead"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredLeads.length === 0 && (
            <div className="p-8 text-center text-white/60">
              No leads found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead View Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white max-w-6xl max-h-[95vh] overflow-y-auto border border-white/10">
          <DialogHeader className="border-b border-white/10 mb-6">
            <DialogTitle className="text-2xl flex items-center gap-3">
              {selectedLead ? (
                <>
                  <Eye className="h-6 w-6 text-blue-400" />
                  Lead Details: {selectedLead.name}
                </>
              ) : (
                <>
                  <User className="h-6 w-6 text-green-400" />
                  Add New Lead
                </>
              )}
            </DialogTitle>
            {selectedLead && (
              <div className="flex items-center gap-4 text-sm text-white/70 mt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created: {format(new Date(selectedLead.created_at), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time: {format(new Date(selectedLead.created_at), 'HH:mm')}
                </div>
                {selectedLead.updated_at !== selectedLead.created_at && (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Updated: {format(new Date(selectedLead.updated_at), 'MMM dd, HH:mm')}
                  </div>
                )}
              </div>
            )}
          </DialogHeader>
          
          {selectedLead ? (
            /* Lead Display View */
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information Card */}
                <div className="lg:col-span-1">
                  <div className="bg-zinc-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-400" />
                      Contact Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white/70 text-sm font-medium">Full Name</Label>
                        <div className="mt-1 p-3 bg-zinc-700/50 rounded-lg border border-white/10">
                          <p className="text-white font-medium">{selectedLead.name}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-white/70 text-sm font-medium">Email Address</Label>
                        <div className="mt-1 p-3 bg-zinc-700/50 rounded-lg border border-white/10">
                          {selectedLead.email ? (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-blue-400" />
                              <p className="text-white">{selectedLead.email}</p>
                            </div>
                          ) : (
                            <p className="text-white/50 italic">No email provided</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-white/70 text-sm font-medium">Phone Number</Label>
                        <div className="mt-1 p-3 bg-zinc-700/50 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-green-400" />
                            <p className="text-white font-medium">{selectedLead.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Lead Details Card */}
                <div className="lg:col-span-1">
                  <div className="bg-zinc-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      Lead Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white/70 text-sm font-medium">Interest</Label>
                        <div className="mt-1 p-3 bg-zinc-700/50 rounded-lg border border-white/10">
                          {selectedLead.interest ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {INTEREST_OPTIONS.find(i => i.value === selectedLead.interest)?.icon || "🔧"}
                              </span>
                              <p className="text-white">
                                {INTEREST_OPTIONS.find(i => i.value === selectedLead.interest)?.label || selectedLead.interest}
                              </p>
                            </div>
                          ) : (
                            <p className="text-white/50 italic">No interest specified</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-white/70 text-sm font-medium">Current Status</Label>
                        <div className="mt-1">
                          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger className="border-white/20 bg-zinc-700 text-white">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="border-white/20 bg-zinc-800 text-white">
                              {STATUS_OPTIONS.map(status => (
                                <SelectItem key={status.value} value={status.value}>
                                  <span className="flex items-center gap-2">
                                    <span>{status.icon}</span>
                                    <span>{status.label}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-white/70 text-sm font-medium">Assigned Team Member</Label>
                        <div className="mt-1">
                          <Select value={formData.team_member_id || "unassigned"} onValueChange={(value) => setFormData(prev => ({ ...prev, team_member_id: value === "unassigned" ? "" : value }))}>
                            <SelectTrigger className="border-white/20 bg-zinc-700 text-white">
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent className="border-white/20 bg-zinc-800 text-white">
                              <SelectItem value="unassigned">
                                <span className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>Unassigned</span>
                                </span>
                              </SelectItem>
                              {teamMembers.map(member => (
                                <SelectItem key={member.id} value={member.id}>
                                  <span className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={formatTeamMemberImagePath(member.image_path)} alt={member.name} />
                                      <AvatarFallback className="bg-blue-500/20 text-blue-300 text-xs">
                                        {getInitials(member.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{member.name}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Messages Card */}
                <div className="lg:col-span-1">
                  <div className="bg-zinc-800/50 rounded-xl p-6 border border-white/10 h-fit">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-400" />
                      Initial Message
                    </h3>
                    
                    <div className="p-4 bg-zinc-700/50 rounded-lg border border-white/10 min-h-[120px]">
                      {selectedLead.message ? (
                        <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{selectedLead.message}</p>
                      ) : (
                        <p className="text-white/50 italic">No initial message provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Editable Notes Section */}
              <div className="mt-8">
                <div className="bg-zinc-800/30 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Edit3 className="h-5 w-5 text-orange-400" />
                    Lead Management
                    <span className="text-sm font-normal text-white/60 ml-2">(Editable)</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-white/70 text-sm font-medium">
                      Internal Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="border-white/20 bg-zinc-700 text-white min-h-[140px] focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-4 resize-none"
                      placeholder="Add internal notes about this lead, follow-up reminders, conversation summaries, etc..."
                    />
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-300 text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <strong>Note:</strong> You can edit the lead status, team member assignment, and notes. Contact info and lead details are view-only to prevent accidental changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Add New Lead Form */
            <div className="px-8 pb-8">
              <div className="text-center py-12">
                <User className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Add New Lead Feature</h3>
                <p className="text-white/60 mb-6">New lead creation functionality would go here</p>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-6 border-t border-white/10 bg-zinc-900 px-8 pb-8">
            <div className="text-white/60 text-sm">
              {selectedLead ? 'Lead ID: ' + selectedLead.id : 'Ready to create new lead'}
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-white/20 text-white hover:bg-white/10 px-8 h-11"
                disabled={isSaving}
              >
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
              {selectedLead && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 px-8 h-11"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}