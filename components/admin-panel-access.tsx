"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { X } from "lucide-react"
import Link from "next/link"

export default function AdminPanelAccess() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAdmin(!!session)
    }

    checkAdminStatus()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  if (!isAdmin || isDismissed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-white/20 py-3 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-white/70 mr-3 text-sm">Admin access:</span>
        <Link href="/admin/dashboard" className="text-white hover:text-primary transition-colors text-sm font-medium">
          Access Admin Panel
        </Link>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="text-white/50 hover:text-white transition-colors"
        aria-label="Dismiss admin panel notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
