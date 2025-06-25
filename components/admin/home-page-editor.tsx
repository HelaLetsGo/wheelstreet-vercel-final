"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Loader2,
  Save,
  Eye,
  AlertTriangle,
  Check,
  PlusCircle,
  ImageIcon,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/custom-dialog"
import ServiceTabsEditor from "@/components/admin/service-tabs-editor"
import { Switch } from "@/components/ui/switch"

interface SectionContent {
  id: string
  title: string
  subtitle?: string
  description?: string
  cta_text?: string
  cta_link?: string
  image_path?: string
  order?: number
  is_active?: boolean
  section_type: string
  content_json?: any
}

export default function HomePageEditor() {
  const [sections, setSections] = useState<SectionContent[]>([])
  const [currentSection, setCurrentSection] = useState<SectionContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("hero")
  const [isNewSectionDialogOpen, setIsNewSectionDialogOpen] = useState(false)
  const [newSection, setNewSection] = useState<Partial<SectionContent>>({
    title: "",
    section_type: "",
    is_active: true,
    order: 0,
  })
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      setIsLoading(true)
      const { data, error: fetchError } = await supabase.from("page_sections").select("*").order("order")

      if (fetchError) throw fetchError

      if (data) {
        setSections(data)
        // Set the first section as current if available
        if (data.length > 0) {
          const heroSection = data.find((section) => section.section_type === "hero") || data[0]
          setCurrentSection(heroSection)
          setActiveTab(heroSection.section_type)
        }
      }
    } catch (err) {
      console.error("Error fetching sections:", err)
      setError("Failed to load page sections")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (currentSection) {
      setCurrentSection({
        ...currentSection,
        [name]: value,
      })
    }
  }

  const handleNewSectionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewSection({
      ...newSection,
      [name]: value,
    })
  }

  const handleToggleChange = (checked: boolean) => {
    if (currentSection) {
      setCurrentSection({
        ...currentSection,
        is_active: checked,
      })
    }
  }

  const handleContentJsonChange = (key: string, value: string) => {
    if (currentSection) {
      const contentJson = currentSection.content_json || {}
      setCurrentSection({
        ...currentSection,
        content_json: {
          ...contentJson,
          [key]: value,
        },
      })
    }
  }

  const saveSection = async () => {
    if (!currentSection) return

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      const { error: updateError } = await supabase
        .from("page_sections")
        .update(currentSection)
        .eq("id", currentSection.id)

      if (updateError) throw updateError

      // Update the sections array with the updated section
      setSections(sections.map((section) => (section.id === currentSection.id ? currentSection : section)))

      setSuccess("Section updated successfully! Click 'Preview Changes' to see updates on the homepage.")

      // Clear cache to force refresh on homepage
      try {
        sessionStorage.removeItem(`content_${currentSection.section_type}`)
        // Also clear any other cached content that might be affected
        const keys = Object.keys(sessionStorage)
        keys.forEach(key => {
          if (key.startsWith('content_')) {
            sessionStorage.removeItem(key)
          }
        })
      } catch (e) {
        // Ignore storage errors
      }
    } catch (err) {
      console.error("Error saving section:", err)
      setError(err.message || "Failed to save section")
    } finally {
      setIsSaving(false)
    }
  }

  const createNewSection = async () => {
    try {
      setIsSaving(true)
      setError(null)

      // Validate required fields
      if (!newSection.section_type || !newSection.title) {
        setError("Section type and title are required")
        setIsSaving(false)
        return
      }

      // Find the highest order value and add 1
      const maxOrder = Math.max(...sections.map((s) => s.order || 0), 0)
      const sectionToCreate = {
        ...newSection,
        order: maxOrder + 1,
        is_active: true,
      }

      const { data, error: insertError } = await supabase.from("page_sections").insert([sectionToCreate]).select()

      if (insertError) throw insertError

      // Refresh sections
      await fetchSections()

      // Set the new section as active
      if (data && data.length > 0) {
        setCurrentSection(data[0])
        setActiveTab(data[0].section_type)
      }

      setIsNewSectionDialogOpen(false)
      setNewSection({
        title: "",
        section_type: "",
        is_active: true,
        order: 0,
      })

      setSuccess("New section created successfully")

      // Clear cache to force refresh on homepage
      try {
        const keys = Object.keys(sessionStorage)
        keys.forEach(key => {
          if (key.startsWith('content_')) {
            sessionStorage.removeItem(key)
          }
        })
      } catch (e) {
        // Ignore storage errors
      }
    } catch (err) {
      console.error("Error creating section:", err)
      setError(err.message || "Failed to create section")
    } finally {
      setIsSaving(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const selectedSection = sections.find((section) => section.section_type === value)
    if (selectedSection) {
      setCurrentSection(selectedSection)
    }
  }

  const moveSection = async (direction: "up" | "down") => {
    if (!currentSection) return

    const currentIndex = sections.findIndex((s) => s.id === currentSection.id)
    if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === sections.length - 1)) {
      return // Already at the top or bottom
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const targetSection = sections[newIndex]

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      // Swap orders
      const currentOrder = currentSection.order || 0
      const targetOrder = targetSection.order || 0

      // Update current section
      await supabase.from("page_sections").update({ order: targetOrder }).eq("id", currentSection.id)

      // Update target section
      await supabase.from("page_sections").update({ order: currentOrder }).eq("id", targetSection.id)

      // Refresh sections
      await fetchSections()

      setSuccess(`Section moved ${direction}`)
    } catch (err) {
      console.error(`Error moving section ${direction}:`, err)
      setError(err.message || `Failed to move section ${direction}`)
    } finally {
      setIsSaving(false)
    }
  }

  const deleteSection = async () => {
    if (!currentSection || !window.confirm(`Are you sure you want to delete the "${currentSection.title}" section?`)) {
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      const { error: deleteError } = await supabase.from("page_sections").delete().eq("id", currentSection.id)

      if (deleteError) throw deleteError

      // Refresh sections
      await fetchSections()

      setSuccess("Section deleted successfully")
    } catch (err) {
      console.error("Error deleting section:", err)
      setError(err.message || "Failed to delete section")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
          <CardTitle className="text-white mb-4 sm:mb-0 text-2xl">Home Page Editor</CardTitle>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                // Clear cache and then open preview
                try {
                  const keys = Object.keys(sessionStorage)
                  keys.forEach(key => {
                    if (key.startsWith('content_')) {
                      sessionStorage.removeItem(key)
                    }
                  })
                } catch (e) {
                  // Ignore storage errors
                }
                window.open("/", "_blank")
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Changes
            </Button>
            <Button onClick={() => setIsNewSectionDialogOpen(true)} className="bg-white text-black hover:bg-white/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Sidebar with section list */}
            <div className="bg-zinc-900 p-4 border-r border-white/10 md:min-h-[600px]">
              <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Page Sections</h3>
              <div className="space-y-1">
                {sections
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleTabChange(section.section_type)}
                      className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between ${
                        activeTab === section.section_type ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <span className="truncate">
                        {section.section_type.charAt(0).toUpperCase() + section.section_type.slice(1)}
                      </span>
                      {!section.is_active && (
                        <span className="text-xs bg-yellow-600/20 text-yellow-400 px-1.5 py-0.5 rounded">Inactive</span>
                      )}
                    </button>
                  ))}
              </div>
            </div>

            {/* Main content area */}
            <div className="p-6 md:col-span-3">
              {currentSection && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                      {currentSection.section_type.charAt(0).toUpperCase() + currentSection.section_type.slice(1)}{" "}
                      Section
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={currentSection.is_active || false}
                          onCheckedChange={handleToggleChange}
                          id="is_active"
                        />
                        <Label htmlFor="is_active" className="text-white cursor-pointer">
                          {currentSection.is_active ? "Active" : "Inactive"}
                        </Label>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => moveSection("up")}
                          className="h-8 w-8 border-white/20 text-white hover:bg-white/10"
                          disabled={sections.indexOf(currentSection) === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => moveSection("down")}
                          className="h-8 w-8 border-white/20 text-white hover:bg-white/10"
                          disabled={sections.indexOf(currentSection) === sections.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Card className="border-white/10 bg-zinc-900">
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="text-white">
                              Title
                            </Label>
                            <Input
                              id="title"
                              name="title"
                              value={currentSection.title || ""}
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
                              value={currentSection.subtitle || ""}
                              onChange={handleInputChange}
                              className="border-white/20 bg-zinc-800 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cta_text" className="text-white">
                              CTA Text
                            </Label>
                            <Input
                              id="cta_text"
                              name="cta_text"
                              value={currentSection.cta_text || ""}
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
                              value={currentSection.cta_link || ""}
                              onChange={handleInputChange}
                              className="border-white/20 bg-zinc-800 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={currentSection.description || ""}
                          onChange={handleInputChange}
                          className="h-32 border-white/20 bg-zinc-800 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image_path" className="text-white flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Image Path
                        </Label>
                        <Input
                          id="image_path"
                          name="image_path"
                          value={currentSection.image_path || ""}
                          onChange={handleInputChange}
                          className="border-white/20 bg-zinc-800 text-white"
                        />
                        <p className="text-xs text-white/60">
                          Enter the path to the image file (e.g., /hero-car-1.jpg)
                        </p>
                      </div>

                      {/* Additional fields for content_json if it exists */}
                      {currentSection.content_json && Object.keys(currentSection.content_json).length > 0 && (
                        <div className="mt-6 border-t border-white/10 pt-6">
                          <h3 className="mb-4 text-lg font-medium text-white">Additional Content</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(currentSection.content_json).map(([key, value]) => (
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

                      {/* Service Tabs Editor for the services section */}
                      {currentSection.section_type === "services" && (
                        <div className="mt-6 border-t border-white/10 pt-6">
                          <h3 className="mb-4 text-lg font-medium text-white">Service Tabs</h3>
                          <ServiceTabsEditor sectionId={currentSection.id} />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t border-white/10 p-6 flex flex-col sm:flex-row justify-between gap-4">
                      <Button
                        variant="destructive"
                        onClick={deleteSection}
                        disabled={isSaving || sections.length <= 1}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Section
                      </Button>
                      <Button
                        onClick={saveSection}
                        disabled={isSaving}
                        className="bg-white text-black hover:bg-white/90 w-full sm:w-auto"
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-6 border-red-500/30 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-6 border-green-500/30 bg-green-500/10">
                  <Check className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Section Dialog */}
      <Dialog open={isNewSectionDialogOpen} onOpenChange={setIsNewSectionDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="section_type" className="text-white">
                Section Type (unique identifier, lowercase)
              </Label>
              <Input
                id="section_type"
                name="section_type"
                value={newSection.section_type || ""}
                onChange={handleNewSectionInputChange}
                placeholder="e.g. testimonials, features, gallery"
                className="border-white/20 bg-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_title" className="text-white">
                Section Title
              </Label>
              <Input
                id="new_title"
                name="title"
                value={newSection.title || ""}
                onChange={handleNewSectionInputChange}
                placeholder="e.g. Our Testimonials, Features"
                className="border-white/20 bg-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_description" className="text-white">
                Description (optional)
              </Label>
              <Textarea
                id="new_description"
                name="description"
                value={newSection.description || ""}
                onChange={handleNewSectionInputChange}
                placeholder="Brief description of this section"
                className="border-white/20 bg-zinc-800 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsNewSectionDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={createNewSection}
              disabled={isSaving || !newSection.section_type || !newSection.title}
              className="bg-white text-black hover:bg-white/90"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {isSaving ? "Creating..." : "Create Section"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
