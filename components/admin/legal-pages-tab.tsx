"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, Edit2, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/custom-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createBrowserClient } from "@supabase/ssr"

export default function LegalPagesTab() {
  const [legalPages, setLegalPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchLegalPages()
  }, [])

  const fetchLegalPages = async () => {
    try {
      setLoading(true)

      // Use the browser client directly
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from("legal_pages")
        .select("*")
        .order("page_type")

      if (error) {
        throw error
      }

      setLegalPages(data || [])
    } catch (err) {
      console.error("Error fetching legal pages:", err)
      setError("Failed to fetch legal pages")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (page: any) => {
    setSelectedPage({ ...page })
    setIsEditing(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSelectedPage({
      ...selectedPage,
      [name]: value,
    })
  }

  const handleSave = async () => {
    if (!selectedPage) return

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      // Use the browser client directly
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const updateData = {
        title: selectedPage.title,
        content: selectedPage.content,
        page_type: selectedPage.page_type,
        is_active: selectedPage.is_active !== undefined ? selectedPage.is_active : true,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("legal_pages")
        .update(updateData)
        .eq("id", selectedPage.id)

      if (error) {
        throw error
      }

      // Update the local state
      const updatedPage = { ...selectedPage, ...updateData }
      setLegalPages(
        legalPages.map((page) =>
          page.id === selectedPage.id ? updatedPage : page,
        ),
      )

      setSuccess("Page updated successfully")

      // Close the dialog after a short delay
      setTimeout(() => {
        setIsEditing(false)
        setSuccess(null)
        // Refresh the data
        fetchLegalPages()
      }, 1500)
    } catch (err) {
      console.error("Error saving page:", err)
      setError(err.message || "Failed to save page")
    } finally {
      setIsSaving(false)
    }
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
        <h2 className="text-2xl font-bold text-white">Legal Pages</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {legalPages.map((page) => (
          <Card key={page.id} className="border-white/10 bg-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">{page.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center text-xs text-white/60">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                <span>Last updated: {format(new Date(page.last_updated), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <a
                  href={`/${page.page_type}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-primary hover:underline"
                >
                  View Page <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(page)}>
                  <Edit2 className="mr-1 h-4 w-4" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-zinc-900 text-white max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit {selectedPage?.title}</DialogTitle>
          </DialogHeader>

          {selectedPage && (
            <div className="space-y-4 overflow-y-auto pr-2 max-h-[calc(90vh-10rem)]">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={selectedPage.title || ""}
                  onChange={handleInputChange}
                  className="border-white/20 bg-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-white">
                  Content (HTML)
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={selectedPage.content || ""}
                  onChange={handleInputChange}
                  className="h-[50vh] font-mono text-sm border-white/20 bg-zinc-800 text-white"
                />
              </div>

              {error && (
                <Alert className="border-red-500/30 bg-red-500/10">
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500/30 bg-green-500/10">
                  <AlertDescription className="text-green-300">{success}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-white/20 text-white hover:bg-white/10"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-white text-black hover:bg-white/90">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
