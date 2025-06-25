import type React from "react"
import { AdminUIProvider } from "@/components/admin/admin-ui-provider"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminUIProvider>{children}</AdminUIProvider>
}
