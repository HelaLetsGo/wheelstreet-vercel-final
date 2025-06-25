"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, Plus, Trash, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@supabase/ssr"
import { getAvailableTeamPhotos } from "@/lib/image-utils"

interface TeamMember {
  id?: string
  member_id: string
  name: string
  position: string
  image_path: string
  bio: string[]
  contact: {
    email?: string
    phone?: string
    linkedin?: string
  }
}

interface EditTeamMemberFormProps {
  teamMember: TeamMember | null
  onSubmit: () => void
}

export default function EditTeamMemberForm({ teamMember, onSubmit }: EditTeamMemberFormProps) {
  const [formData, setFormData] = useState<TeamMember>({
    member_id: "",
    name: "",
    position: "",
    image_path: "",
    bio: [""],
    contact: {
      email: "",
      phone: "",
      linkedin: "",
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useCustomPath, setUseCustomPath] = useState(false)
  const availablePhotos = getAvailableTeamPhotos()

  useEffect(() => {
    if (teamMember) {
      const imagePath = teamMember.image_path
      const isCustomPath = imagePath && !availablePhotos.some(photo => 
        imagePath.includes(photo) || imagePath === `/team/${photo}`
      )
      
      setFormData({
        ...teamMember,
        bio: teamMember.bio || [""],
        contact: teamMember.contact || { email: "", phone: "", linkedin: "" },
      })
      setUseCustomPath(isCustomPath)
    }
  }, [teamMember, availablePhotos])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }))
  }

  const handleBioChange = (index: number, value: string) => {
    const newBio = [...formData.bio]
    newBio[index] = value
    setFormData((prev) => ({ ...prev, bio: newBio }))
  }

  const addBioParagraph = () => {
    setFormData((prev) => ({ ...prev, bio: [...prev.bio, ""] }))
  }

  const removeBioParagraph = (index: number) => {
    if (formData.bio.length <= 1) return

    const newBio = [...formData.bio]
    newBio.splice(index, 1)
    setFormData((prev) => ({ ...prev, bio: newBio }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const teamMemberData = {
        member_id: formData.member_id,
        name: formData.name,
        position: formData.position,
        image_path: formData.image_path,
        bio: formData.bio,
        contact: formData.contact,
      }

      let error

      if (teamMember?.id) {
        // Update existing team member
        const { error: updateError } = await supabase
          .from("team_members")
          .update(teamMemberData)
          .eq("id", teamMember.id)
        error = updateError
      } else {
        // Create new team member
        const { error: insertError } = await supabase
          .from("team_members")
          .insert([teamMemberData])
        error = insertError
      }

      if (error) {
        throw error
      }

      onSubmit()
    } catch (error) {
      console.error("Error saving team member:", error)
      setError(error instanceof Error ? error.message : "Failed to save team member")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto pr-2">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-300">
          <p>{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-white font-medium text-sm">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="border-white/20 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 h-11"
              placeholder="Full name"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="position" className="text-white font-medium text-sm">Position</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="border-white/20 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 h-11"
              placeholder="Job title"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="member_id" className="text-white font-medium text-sm">ID (URL slug)</Label>
            <Input
              id="member_id"
              name="member_id"
              value={formData.member_id}
              onChange={handleInputChange}
              placeholder="e.g. john-doe (auto-generated if empty)"
              className="border-white/20 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 h-11"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white font-medium text-sm flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Team Photo
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUseCustomPath(!useCustomPath)}
                className="border-white/20 text-white hover:bg-white/10 h-8 text-xs"
              >
                {useCustomPath ? "Use Dropdown" : "Custom Path"}
              </Button>
            </div>
            
            {!useCustomPath ? (
              <Select
                value={formData.image_path}
                onValueChange={(value) => setFormData(prev => ({ ...prev, image_path: value }))}
              >
                <SelectTrigger className="border-white/20 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 h-11">
                  <SelectValue placeholder="Select a team photo" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-zinc-800 text-white max-h-60">
                  {availablePhotos.map(photo => {
                    const displayName = photo
                      .replace(/\.(jpg|jpeg|png|webp)$/i, '')
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                    return (
                      <SelectItem key={photo} value={`/team/${photo}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{displayName}</div>
                            <div className="text-xs text-white/60">{photo}</div>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="image_path"
                name="image_path"
                value={formData.image_path}
                onChange={handleInputChange}
                placeholder="/team/member-name.jpg"
                className="border-white/20 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 h-11"
              />
            )}
            
            {/* Image Preview */}
            {formData.image_path && (
              <div className="mt-3">
                <div className="text-xs text-white/60 mb-2">Preview:</div>
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/20 bg-zinc-800">
                  <img
                    src={formData.image_path}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/team-placeholder.svg'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3">
          Biography
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white font-medium text-sm">Bio Paragraphs</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addBioParagraph} 
              className="border-white/20 text-white hover:bg-white/10 h-8"
            >
              <Plus className="mr-2 h-3 w-3" />
              Add Paragraph
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.bio.map((paragraph, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => handleBioChange(index, e.target.value)}
                    placeholder={`Bio paragraph ${index + 1}...`}
                    className="border-white/20 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
                    rows={3}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeBioParagraph(index)}
                  disabled={formData.bio.length <= 1}
                  className="shrink-0 border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 w-8 mt-1"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3">
          Contact Information
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-white font-medium text-sm">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.contact.email || ""}
              onChange={handleContactChange}
              placeholder="email@example.com"
              className="border-white/20 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 h-11"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-white font-medium text-sm">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.contact.phone || ""}
              onChange={handleContactChange}
              placeholder="+370 600 12345"
              className="border-white/20 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 h-11"
            />
          </div>

          <div className="space-y-3 sm:col-span-2">
            <Label htmlFor="linkedin" className="text-white font-medium text-sm">LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin"
              value={formData.contact.linkedin || ""}
              onChange={handleContactChange}
              placeholder="linkedin.com/in/username"
              className="border-white/20 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 h-11"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-white/10 mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSubmit}
          className="border-white/20 text-white hover:bg-white/10 px-6 h-11"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading} 
          className="bg-white text-black hover:bg-white/90 px-6 h-11 font-medium"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {teamMember ? "Update Member" : "Create Member"}
        </Button>
      </div>
    </form>
  )
}
