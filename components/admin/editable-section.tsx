"use client"

import type React from "react"

import { useState, type ReactNode, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Pencil, X, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/custom-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Import the useAdminUI hook
import { useAdminUI } from "@/components/admin/admin-ui-provider"

interface EditableSectionProps {
  children: ReactNode
  sectionType: string
  sectionId: string
  title?: string
}

export default function EditableSection({ children, sectionType, sectionId, title }: EditableSectionProps) {
  // Replace the isAdmin state with the hook
  // const [isAdmin, setIsAdmin] = useState(false)
  const { isAdmin } = useAdminUI()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sectionData, setSectionData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Create Supabase client only if environment variables are available
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    ? createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null

  // Remove the useEffect that checks admin status since we're now using the provider
  // useEffect(() => {
  //   const checkAdminStatus = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession()
  //     setIsAdmin(!!session)
  //   }

  //   checkAdminStatus()

  //   // Subscribe to auth changes
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setIsAdmin(!!session)
  //   })

  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [supabase])

  const fetchSectionData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!supabase) {
        // When Supabase is not available (during build), just set loading to false
        setIsLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from("page_sections")
        .select("*")
        .eq("section_type", sectionType)
        .single()

      if (fetchError) throw fetchError

      setSectionData(data)
    } catch (err) {
      console.error("Error fetching section data:", err)
      setError("Failed to load section data")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, sectionType])

  const handleEditClick = async () => {
    await fetchSectionData()
    setIsEditing(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSectionData({
      ...sectionData,
      [name]: value,
    })
  }

  const handleContentJsonChange = (key: string, value: string) => {
    if (sectionData) {
      const contentJson = sectionData.content_json || {}
      setSectionData({
        ...sectionData,
        content_json: {
          ...contentJson,
          [key]: value,
        },
      })
    }
  }

  const handleSave = async () => {
    if (!sectionData) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      if (!supabase) {
        setError("Service unavailable during build")
        setIsLoading(false)
        return
      }

      const { error: updateError } = await supabase.from("page_sections").update(sectionData).eq("id", sectionData.id)

      if (updateError) throw updateError

      setSuccess("Section updated successfully")

      // Close the dialog after a short delay
      setTimeout(() => {
        setIsEditing(false)
        setSuccess(null)
        // Reload the page to reflect changes
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error("Error saving section:", err)
      setError(err.message || "Failed to save section")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="group relative">
      {children}

      {/* Inline edit buttons for headings and text */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="relative w-full h-full">
          {/* Single main edit button in the top-right corner */}
          <button
            onClick={handleEditClick}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100 pointer-events-auto"
            aria-label={`Edit ${title || sectionType} section`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-zinc-900 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {title || sectionType} Section</DialogTitle>
          </DialogHeader>

          {isLoading && !sectionData ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : sectionData ? (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={sectionData.title || ""}
                    onChange={handleInputChange}
                    className="border-white/20 bg-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-white">
                    Subtitle
                  </Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={sectionData.subtitle || ""}
                    onChange={handleInputChange}
                    className="border-white/20 bg-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={sectionData.description || ""}
                  onChange={handleInputChange}
                  className="h-24 border-white/20 bg-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta_text" className="text-white">
                    CTA Text
                  </Label>
                  <Input
                    id="cta_text"
                    name="cta_text"
                    value={sectionData.cta_text || ""}
                    onChange={handleInputChange}
                    className="border-white/20 bg-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_link" className="text-white">
                    CTA Link
                  </Label>
                  <Input
                    id="cta_link"
                    name="cta_link"
                    value={sectionData.cta_link || ""}
                    onChange={handleInputChange}
                    className="border-white/20 bg-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_path" className="text-white">
                  Image Path
                </Label>
                <Input
                  id="image_path"
                  name="image_path"
                  value={sectionData.image_path || ""}
                  onChange={handleInputChange}
                  className="border-white/20 bg-zinc-800 text-white"
                />
              </div>

              {/* Additional fields for content_json if it exists */}
              {sectionData.content_json && (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <h3 className="mb-4 text-lg font-medium text-white">Additional Content</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(sectionData.content_json).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-white capitalize">
                          {key.replace(/_/g, " ")}
                        </Label>
                        <Input
                          id={key}
                          value={value as string}
                          onChange={(e) => handleContentJsonChange(key, e.target.value)}
                          className="border-white/20 bg-zinc-800 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
            </div>
          ) : (
            <Alert className="border-red-500/30 bg-red-500/10">
              <AlertDescription className="text-red-300">Failed to load section data</AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
