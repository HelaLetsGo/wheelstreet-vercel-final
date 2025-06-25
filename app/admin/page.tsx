import { redirect } from "next/navigation"

// This file ensures that /admin redirects to /admin/login
export default function AdminPage() {
  redirect("/admin/login")
}
