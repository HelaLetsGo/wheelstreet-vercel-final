"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Edit2, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/custom-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import EditTeamMemberForm from "./edit-team-member-form"
import { createBrowserClient } from "@supabase/ssr"

export default function TeamMembersTab() {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!url || !key) {
        throw new Error("Missing Supabase configuration. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
      }

      const supabase = createBrowserClient(url, key)

      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("name")

      if (error) {
        throw error
      }

      setTeamMembers(data || [])
    } catch (error) {
      console.error("Error fetching team members:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch team members")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member: any) => {
    setSelectedMember(member)
    setIsEditing(true)
    setIsOpen(true)
  }

  const handleCreate = () => {
    setSelectedMember(null)
    setIsEditing(false)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      setError(null)

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id)

      if (error) {
        throw error
      }

      fetchTeamMembers()
    } catch (error) {
      console.error("Error deleting team member:", error)
      setError(error instanceof Error ? error.message : "Failed to delete team member")
    }
  }

  const handleFormSubmit = () => {
    setIsOpen(false)
    fetchTeamMembers()
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Team Members</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-white text-black hover:bg-white/90"
              onClick={handleCreate}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 text-white w-full max-w-3xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
            </DialogHeader>
            <EditTeamMemberForm teamMember={selectedMember} onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="rounded-md bg-red-500/20 p-4 text-sm text-red-400">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id} className="border-white/10 bg-zinc-800">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.image_path || "/team-placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-white">{member.name}</CardTitle>
                <p className="text-sm text-white/60">{member.position}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                {member.bio && member.bio.length > 0 && (
                  <div className="w-full pt-2">
                    <p className="line-clamp-2">{member.bio[0]}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(member.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="mt-10 text-center text-white/60">
          <p>No team members found. Add your first team member to get started.</p>
        </div>
      )}
    </div>
  )
}
