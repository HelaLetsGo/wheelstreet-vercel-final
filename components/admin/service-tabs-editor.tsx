"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleTabs, SimpleTabsList, SimpleTabsTrigger, SimpleTabsContent } from "@/components/ui/simple-tabs"
import { Loader2, Save, PlusCircle, Trash2, AlertTriangle, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/custom-dialog"
import { ImageIcon } from "lucide-react"

interface ServiceTab {
  id: string
  section_id: string
  tab_id: string
  title: string
  short_desc?: string
  full_desc?: string
  icon?: string
  display_order?: number
  is_active?: boolean
  benefits?: string[]
  image_path?: string // Added image_path property
}

interface ServiceTabsEditorProps {
  sectionId: string
}

export default function ServiceTabsEditor({ sectionId }: ServiceTabsEditorProps) {
  const [serviceTabs, setServiceTabs] = useState<ServiceTab[]>([])
  const [currentTab, setCurrentTab] = useState<ServiceTab | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTabId, setActiveTabId] = useState<string>("")
  const [isNewTabDialogOpen, setIsNewTabDialogOpen] = useState(false)
  const [newTab, setNewTab] = useState<Partial<ServiceTab>>({
    section_id: sectionId,
    tab_id: "",
    title: "",
    is_active: true,
  })
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    fetchServiceTabs()
  }, [sectionId])

  const fetchServiceTabs = async () => {
    try {
      setIsLoading(true)
      const { data, error: fetchError } = await supabase
        .from("service_tabs")
        .select("*")
        .eq("section_id", sectionId)
        .order("display_order")

      if (fetchError) throw fetchError

      if (data && data.length > 0) {
        setServiceTabs(data)
        setCurrentTab(data[0])
        setActiveTabId(data[0].tab_id)
      } else {
        setError("No service tabs found. Create your first service tab using the 'Add New Tab' button.")
      }
    } catch (err) {
      console.error("Error fetching service tabs:", err)
      setError("Failed to load service tabs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (currentTab) {
      setCurrentTab({
        ...currentTab,
        [name]: value,
      })
    }
  }

  const handleNewTabInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTab({
      ...newTab,
      [name]: value,
    })
  }

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    if (currentTab) {
      setCurrentTab({
        ...currentTab,
        [name]: checked,
      })
    }
  }

  const handleBenefitChange = (index: number, value: string) => {
    if (currentTab && currentTab.benefits) {
      const newBenefits = [...currentTab.benefits]
      newBenefits[index] = value
      setCurrentTab({
        ...currentTab,
        benefits: newBenefits,
      })
    }
  }

  const addBenefit = () => {
    if (currentTab) {
      const benefits = currentTab.benefits || []
      setCurrentTab({
        ...currentTab,
        benefits: [...benefits, ""],
      })
    }
  }

  const removeBenefit = (index: number) => {
    if (currentTab && currentTab.benefits && currentTab.benefits.length > 1) {
      const newBenefits = [...currentTab.benefits]
      newBenefits.splice(index, 1)
      setCurrentTab({
        ...currentTab,
        benefits: newBenefits,
      })
    }
  }

  const saveTab = async () => {
    if (!currentTab) return

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)

      const { error: updateError } = await supabase.from("service_tabs").update(currentTab).eq("id", currentTab.id)

      if (updateError) throw updateError

      // Update the tabs array with the updated tab
      setServiceTabs(serviceTabs.map((tab) => (tab.id === currentTab.id ? currentTab : tab)))

      setSuccess("Service tab updated successfully")
    } catch (err) {
      console.error("Error saving service tab:", err)
      setError(err.message || "Failed to save service tab")
    } finally {
      setIsSaving(false)
    }
  }

  const createNewTab = async () => {
    try {
      setIsSaving(true)
      setError(null)

      // Validate required fields
      if (!newTab.tab_id || !newTab.title) {
        setError("Tab ID and title are required")
        setIsSaving(false)
        return
      }

      // Find the highest display_order value and add 1
      const maxOrder = Math.max(...serviceTabs.map((s) => s.display_order || 0), 0)
      const tabToCreate = {
        ...newTab,
        section_id: sectionId,
        display_order: maxOrder + 1,
        is_active: true,
        benefits: ["Add your first benefit here"],
      }

      const { data, error: insertError } = await supabase.from("service_tabs").insert([tabToCreate]).select()

      if (insertError) throw insertError

      // Refresh tabs
      await fetchServiceTabs()

      // Set the new tab as active
      if (data && data.length > 0) {
        setCurrentTab(data[0])
        setActiveTabId(data[0].tab_id)
      }

      setIsNewTabDialogOpen(false)
      setNewTab({
        section_id: sectionId,
        tab_id: "",
        title: "",
        is_active: true,
      })

      setSuccess("New tab created successfully")
    } catch (err) {
      console.error("Error creating tab:", err)
      setError(err.message || "Failed to create tab")
    } finally {
      setIsSaving(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTabId(value)
    const selectedTab = serviceTabs.find((tab) => tab.tab_id === value)
    if (selectedTab) {
      setCurrentTab(selectedTab)
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-white mb-4 sm:mb-0">Service Tabs Editor</CardTitle>
          <Button onClick={() => setIsNewTabDialogOpen(true)} className="bg-white text-black hover:bg-white/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Tab
          </Button>
        </CardHeader>
        <CardContent>
          {serviceTabs.length === 0 ? (
            <Alert className="border-yellow-500/30 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-300" />
              <AlertDescription className="text-yellow-300">
                No service tabs found. Create your first tab using the 'Add New Tab' button.
              </AlertDescription>
            </Alert>
          ) : (
            <SimpleTabs defaultValue={activeTabId} value={activeTabId} onValueChange={handleTabChange}>
              <div className="overflow-x-auto pb-2">
                <SimpleTabsList className="mb-6 inline-flex min-w-full bg-zinc-900">
                  {serviceTabs.map((tab) => (
                    <SimpleTabsTrigger
                      key={tab.id}
                      value={tab.tab_id}
                      className="data-[state=active]:bg-white data-[state=active]:text-black whitespace-nowrap"
                    >
                      {tab.title}
                    </SimpleTabsTrigger>
                  ))}
                </SimpleTabsList>
              </div>

              {serviceTabs.map((tab) => (
                <SimpleTabsContent key={tab.id} value={tab.tab_id} className="space-y-4">
                  {currentTab && currentTab.id === tab.id && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-white">
                            Title
                          </Label>
                          <Input
                            id="title"
                            name="title"
                            value={currentTab.title || ""}
                            onChange={handleInputChange}
                            className="border-white/20 bg-zinc-900 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="icon" className="text-white">
                            Icon (Lucide icon name)
                          </Label>
                          <Input
                            id="icon"
                            name="icon"
                            value={currentTab.icon || ""}
                            onChange={handleInputChange}
                            className="border-white/20 bg-zinc-900 text-white"
                            placeholder="Shield, CreditCard, Zap, etc."
                          />
                        </div>
                      </div>

                      {/* Add image path field */}
                      <div className="space-y-2">
                        <Label htmlFor="image_path" className="text-white flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Image Path
                        </Label>
                        <Input
                          id="image_path"
                          name="image_path"
                          value={currentTab.image_path || ""}
                          onChange={handleInputChange}
                          className="border-white/20 bg-zinc-900 text-white"
                          placeholder="/path/to/image.jpg"
                        />
                        <p className="text-xs text-white/60">
                          Enter the path to the image file (e.g., /acquisition-image.jpg)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="short_desc" className="text-white">
                          Short Description
                        </Label>
                        <Textarea
                          id="short_desc"
                          name="short_desc"
                          value={currentTab.short_desc || ""}
                          onChange={handleInputChange}
                          className="h-16 border-white/20 bg-zinc-900 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="full_desc" className="text-white">
                          Full Description
                        </Label>
                        <Textarea
                          id="full_desc"
                          name="full_desc"
                          value={currentTab.full_desc || ""}
                          onChange={handleInputChange}
                          className="h-24 border-white/20 bg-zinc-900 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Benefits</Label>
                        {currentTab.benefits &&
                          currentTab.benefits.map((benefit, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={benefit}
                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                                className="border-white/20 bg-zinc-900 text-white"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBenefit(index)}
                                className="shrink-0 text-red-500 hover:text-red-400"
                                disabled={currentTab.benefits?.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addBenefit}
                          className="mt-2 border-white/20 text-white hover:bg-white/10"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Benefit
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_active"
                          name="is_active"
                          checked={currentTab.is_active || false}
                          onChange={handleToggleChange}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="is_active" className="text-white">
                          Active
                        </Label>
                      </div>
                    </>
                  )}
                </SimpleTabsContent>
              ))}
            </SimpleTabs>
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

          <div className="mt-6 flex justify-end space-x-4">
            <Button
              onClick={saveTab}
              disabled={isSaving || !currentTab}
              className="bg-white text-black hover:bg-white/90"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New Tab Dialog */}
      <Dialog open={isNewTabDialogOpen} onOpenChange={setIsNewTabDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Create New Service Tab</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="tab_id" className="text-white">
                Tab ID (unique identifier, lowercase)
              </Label>
              <Input
                id="tab_id"
                name="tab_id"
                value={newTab.tab_id || ""}
                onChange={handleNewTabInputChange}
                placeholder="e.g. maintenance, warranty, repair"
                className="border-white/20 bg-zinc-900 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_title" className="text-white">
                Tab Title
              </Label>
              <Input
                id="new_title"
                name="title"
                value={newTab.title || ""}
                onChange={handleNewTabInputChange}
                placeholder="e.g. MAINTENANCE, WARRANTY"
                className="border-white/20 bg-zinc-900 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon" className="text-white">
                Icon (Lucide icon name)
              </Label>
              <Input
                id="icon"
                name="icon"
                value={newTab.icon || ""}
                onChange={handleNewTabInputChange}
                placeholder="Shield, CreditCard, Zap, etc."
                className="border-white/20 bg-zinc-900 text-white"
              />
            </div>

            {/* Add image path field to new tab dialog */}
            <div className="space-y-2">
              <Label htmlFor="new_image_path" className="text-white flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image Path
              </Label>
              <Input
                id="new_image_path"
                name="image_path"
                value={newTab.image_path || ""}
                onChange={handleNewTabInputChange}
                placeholder="/path/to/image.jpg"
                className="border-white/20 bg-zinc-900 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_desc" className="text-white">
                Short Description
              </Label>
              <Textarea
                id="short_desc"
                name="short_desc"
                value={newTab.short_desc || ""}
                onChange={handleNewTabInputChange}
                placeholder="Brief description of this service"
                className="border-white/20 bg-zinc-900 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsNewTabDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={createNewTab}
              disabled={isSaving || !newTab.tab_id || !newTab.title}
              className="bg-white text-black hover:bg-white/90"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {isSaving ? "Creating..." : "Create Tab"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
