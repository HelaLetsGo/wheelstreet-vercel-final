"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { createBrowserClient } from "@supabase/ssr"

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

interface DynamicContentLoaderProps {
  sectionType: string
  children: (content: SectionContent | null, isLoading: boolean) => React.ReactNode
}

export default function DynamicContentLoader({ sectionType, children }: DynamicContentLoaderProps) {
  const [content, setContent] = useState<SectionContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Create Supabase client only if environment variables are available
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    ? createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null
  
  const hasAttemptedFetch = useRef(false)

  useEffect(() => {
    const fetchContent = async (useCache = true) => {
      try {
        if (useCache) {
          setIsLoading(true)
        }
        
        if (!supabase) {
          // When Supabase is not available (during build), just set loading to false
          setIsLoading(false)
          return
        }
        
        const { data, error } = await supabase
          .from("page_sections")
          .select("*")
          .eq("section_type", sectionType)
          .eq("is_active", true)
          .single()

        if (error) {
          console.error(`Error fetching ${sectionType} content:`, error)
          return
        }

        // Always update with fresh data
        if (data) {
          setContent(data)
          // Cache the fresh content
          sessionStorage.setItem(`content_${sectionType}`, JSON.stringify(data))
        }
      } catch (err) {
        console.error(`Error in content loader for ${sectionType}:`, err)
      } finally {
        if (useCache) {
          setIsLoading(false)
        }
      }
    }

    // Check if we have cached content
    const cachedContent = sessionStorage.getItem(`content_${sectionType}`)
    if (cachedContent && !hasAttemptedFetch.current) {
      try {
        const parsed = JSON.parse(cachedContent)
        setContent(parsed)
        setIsLoading(false)
        hasAttemptedFetch.current = true
        // Fetch fresh data in background
        fetchContent(false)
      } catch (e) {
        console.error("Error parsing cached content:", e)
        hasAttemptedFetch.current = true
        fetchContent(true)
      }
    } else if (!hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true
      fetchContent(true)
    }
  }, [sectionType, supabase])

  return <>{children(content, isLoading)}</>
}
