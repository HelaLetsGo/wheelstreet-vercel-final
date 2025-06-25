"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { DebugProvider } from "@/components/debug/debug-context"
import DebugPanel from "@/components/debug/debug-panel"
import { Toaster } from "@/components/ui/sonner"

interface AdminUIContextType {
  isAdmin: boolean
  isEditMode: boolean
  setEditMode: (mode: boolean) => void
}

const AdminUIContext = createContext<AdminUIContextType>({
  isAdmin: false,
  isEditMode: false,
  setEditMode: () => {},
})

export const useAdminUI = () => useContext(AdminUIContext)

interface AdminUIProviderProps {
  children: ReactNode
}

export function AdminUIProvider({ children }: AdminUIProviderProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setEditMode] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
          return
        }

        setIsAdmin(!!data.session)

        // Add classes to the body when admin is logged in
        if (!!data.session) {
          document.body.classList.add("admin-logged-in")
          document.body.classList.add("admin-dashboard-active")
        } else {
          document.body.classList.remove("admin-logged-in")
          document.body.classList.remove("admin-dashboard-active")
        }
      } catch (err) {
        console.error("Error in checkAdminStatus:", err)
        setIsAdmin(false)
      }
    }

    checkAdminStatus()

    // Ensure admin-dashboard-active class is added
    document.body.classList.add("admin-dashboard-active")

    // Set up auth state change listener
    const setupAuthListener = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          const isAdminUser = !!session
          setIsAdmin(isAdminUser)

          if (isAdminUser) {
            document.body.classList.add("admin-logged-in")
            document.body.classList.add("admin-dashboard-active")
          } else {
            document.body.classList.remove("admin-logged-in")
            document.body.classList.remove("admin-dashboard-active")
            setEditMode(false)
          }
        })

        // Return the unsubscribe function
        return () => {
          data.subscription.unsubscribe()
        }
      } catch (err) {
        console.error("Error setting up auth listener:", err)
        return () => {}
      }
    }

    const unsubscribe = setupAuthListener()

    return () => {
      // Clean up the subscription when the component unmounts
      unsubscribe.then((unsub) => unsub())
    }
  }, [])

  return (
    <DebugProvider>
      <AdminUIContext.Provider value={{ isAdmin, isEditMode, setEditMode }}>
        <div className="admin-ui-wrapper">
          {children}
          {/* Only show debug panel to admins */}
          {isAdmin && <DebugPanel />}
          <Toaster />
        </div>
      </AdminUIContext.Provider>
    </DebugProvider>
  )
}

export default AdminUIProvider
