"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { DebugProvider } from "@/components/debug/debug-context"
import DebugPanel from "@/components/debug/debug-panel"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface LayoutClientProps {
  children: ReactNode
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith("/admin")

  if (isAdminPage) {
    return <>{children}</>
  }

  return (
    <DebugProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <DebugPanel />
      </div>
    </DebugProvider>
  )
}
