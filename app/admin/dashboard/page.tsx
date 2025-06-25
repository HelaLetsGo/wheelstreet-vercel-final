"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut, Users, MessageSquare, Home, FileText, Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import TeamMembersTab from "@/components/admin/team-members-tab"
import EnhancedLeadsTab from "@/components/admin/enhanced-leads-tab"
import LeadsDashboardTab from "@/components/admin/leads-dashboard-tab"
import Link from "next/link"
import LegalPagesTab from "@/components/admin/legal-pages-tab"
import { createBrowserClient } from "@supabase/ssr"
import { cn } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("leads-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          router.push("/admin/login")
          return
        }

        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )

        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Error getting user:", error)
          setAuthError(error.message)
          setLoading(false)
          return
        }

        if (!data.user) {
          console.log("No user found, redirecting to login")
          router.push("/admin/login")
          return
        }

        setUser(data.user)
        setLoading(false)
      } catch (err: any) {
        console.error("Error in checkUser:", err)
        setAuthError(err.message || "Authentication error")
        setLoading(false)
      }
    }

    checkUser()

    // Check window size for initial sidebar state
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [router])

  const handleSignOut = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        router.push("/admin/login")
        return
      }

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      await supabase.auth.signOut()

      // Clear cookies
      document.cookie = "sb-access-token=; path=/; max-age=0; SameSite=Lax"
      document.cookie = "sb-refresh-token=; path=/; max-age=0; SameSite=Lax"

      router.push("/admin/login")
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="bg-zinc-900 p-8 max-w-md text-center">
          <h2 className="text-xl text-white mb-4">Authentication Error</h2>
          <p className="text-red-400 mb-6">{authError}</p>
          <Button onClick={() => router.push("/admin/login")} className="bg-white text-black hover:bg-white/90">
            Return to Login
          </Button>
        </div>
      </div>
    )
  }

  // Navigation items
  const navItems = [
    {
      id: "leads-dashboard",
      label: "Leads Dashboard",
      icon: <MessageSquare className="h-5 w-5" />,
      component: <LeadsDashboardTab />,
    },
    {
      id: "leads",
      label: "Sales Pipeline",
      icon: <MessageSquare className="h-5 w-5" />,
      component: <EnhancedLeadsTab />,
    },
    {
      id: "team",
      label: "Team Members",
      icon: <Users className="h-5 w-5" />,
      component: <TeamMembersTab />,
    },
    {
      id: "legal",
      label: "Legal Pages",
      icon: <FileText className="h-5 w-5" />,
      component: <LegalPagesTab />,
    },
  ]

  // Advanced tools
  const advancedTools = [
    {
      id: "home-editor",
      label: "Home Page Editor",
      icon: <Home className="h-5 w-5" />,
      href: "/admin/home-editor",
    },
  ]

  // Get active component
  const activeComponent = navItems.find((item) => item.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black h-16 flex-shrink-0">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-white hover:bg-white/10"
              onClick={toggleSidebar}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronRight className={cn("h-5 w-5 transition-transform", sidebarOpen ? "rotate-180" : "rotate-0")} />
            </Button>
            <h1 className="text-lg font-bold text-white tracking-wide">WHEELSTREET Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-white/70 md:inline-block">{user?.email?.split("@")[0]}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white hover:bg-white/10">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        <div
          className={cn("fixed inset-0 z-20 bg-black/80 lg:hidden", mobileMenuOpen ? "block" : "hidden")}
          onClick={closeMobileMenu}
        ></div>

        {/* Sidebar */}
        <aside
          className={cn(
            "border-r border-white/10 bg-zinc-950 transition-all duration-300 ease-in-out",
            // Mobile: fixed overlay
            "fixed inset-y-0 left-0 z-20 mt-16 lg:relative lg:mt-0 lg:flex-shrink-0",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            // Width management
            sidebarOpen ? "w-64" : "w-64 lg:w-20",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-6 lg:hidden">
            <h2 className="font-semibold text-white">Navigation</h2>
            <Button variant="ghost" size="icon" className="text-white" onClick={closeMobileMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-white hover:bg-white/10",
                      activeTab === item.id && "bg-white/10 font-medium",
                      !sidebarOpen && "lg:justify-center",
                      "h-12",
                    )}
                    onClick={() => {
                      setActiveTab(item.id)
                      closeMobileMenu()
                    }}
                  >
                    {item.icon}
                    <span className={cn("ml-3", !sidebarOpen && "lg:hidden")}>{item.label}</span>
                  </Button>
                ))}
              </div>

              <div className="mt-10">
                <h3
                  className={cn(
                    "px-3 mb-4 text-xs font-semibold text-white/50 uppercase tracking-wider",
                    !sidebarOpen && "lg:text-center lg:px-0",
                  )}
                >
                  {!sidebarOpen ? "Tools" : "Advanced Tools"}
                </h3>
                <div className="space-y-1">
                  {advancedTools.map((tool) => (
                    <Link key={tool.id} href={tool.href} onClick={closeMobileMenu} className="block">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-white hover:bg-white/10",
                          !sidebarOpen && "lg:justify-center",
                          "h-12",
                        )}
                      >
                        {tool.icon}
                        <span className={cn("ml-3", !sidebarOpen && "lg:hidden")}>{tool.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-black overflow-auto min-w-0">
          <div className="p-6 w-full max-w-none">{activeComponent}</div>
        </main>
      </div>
    </div>
  )
}
