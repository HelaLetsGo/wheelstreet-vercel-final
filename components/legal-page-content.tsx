"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2 } from "lucide-react"
import { useAdminUI } from "@/components/admin/admin-ui-provider"
import EditableLegalPage from "@/components/admin/editable-legal-page"

interface LegalPageContentProps {
  pageType: string
}

export default function LegalPageContent({ pageType }: LegalPageContentProps) {
  const [pageContent, setPageContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAdmin } = useAdminUI()
  
  // Create Supabase client only if environment variables are available
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    ? createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!supabase) {
          // When Supabase is not available (during build), just set loading to false
          setIsLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from("legal_pages")
          .select("*")
          .eq("page_type", pageType)
          .eq("is_active", true)
          .single()

        if (fetchError) {
          throw fetchError
        }

        setPageContent(data)
      } catch (err) {
        console.error(`Error fetching ${pageType} page content:`, err)
        setError("Failed to load page content. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPageContent()
  }, [pageType, supabase])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (error || !pageContent) {
    return (
      <div className="py-8">
        <p className="text-center text-red-400">{error || "Content not found"}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {isAdmin ? (
        <EditableLegalPage pageContent={pageContent} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />
      )}
    </div>
  )
}
