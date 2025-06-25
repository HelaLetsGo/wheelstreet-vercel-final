"use client"

import type React from "react"

import { useState } from "react"
import { Pencil, X, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/custom-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EditableLegalPageProps {
  pageContent: {
    id: string
    page_type: string
    title: string
    content: string
    last_updated: string
  }
}

export default function EditableLegalPage({ pageContent }: EditableLegalPageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(pageContent)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleEditClick = () => {
    setEditedContent(pageContent)
    setIsEditing(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedContent({
      ...editedContent,
      [name]: value,
    })
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      // Use the API route to update the legal page
      const response = await fetch("/api/admin/update-legal-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: pageContent.id,
          title: editedContent.title,
          content: editedContent.content,
          page_type: pageContent.page_type,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save page")
      }

      setSuccess("Page updated successfully")

      // Close the dialog after a short delay
      setTimeout(() => {
        setIsEditing(false)
        setSuccess(null)
        // Reload the page to reflect changes
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error("Error saving page:", err)
      setError(err.message || "Failed to save page")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="group relative">
      <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />

      {/* Edit button */}
      <button
        onClick={handleEditClick}
        className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100 pointer-events-auto"
        aria-label={`Edit ${pageContent.title}`}
      >
        <Pencil className="h-4 w-4" />
      </button>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-zinc-900 text-white max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit {pageContent.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto pr-2 max-h-[calc(90vh-10rem)]">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={editedContent.title || ""}
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
                value={editedContent.content || ""}
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

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-white/20 text-white hover:bg-white/10"
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-white text-black hover:bg-white/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
