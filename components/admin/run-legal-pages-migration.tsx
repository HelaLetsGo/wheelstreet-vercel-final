"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function RunLegalPagesMigration() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const runMigration = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      // Check if RLS is enabled
      const { data: rlsCheck, error: rlsCheckError } = await supabase.rpc("check_rls_enabled", {
        table_name: "legal_pages",
      })

      if (rlsCheckError) {
        console.error("Error checking RLS:", rlsCheckError)
        // If RPC doesn't exist, we'll try direct SQL
      }

      // Enable RLS if not already enabled
      const { error: enableRlsError } = await supabase.rpc("enable_rls", {
        table_name: "legal_pages",
      })

      if (enableRlsError) {
        console.error("Error enabling RLS:", enableRlsError)
        // Continue anyway as it might already be enabled
      }

      // Drop existing policies
      const { error: dropPolicyError1 } = await supabase.rpc("drop_policy_if_exists", {
        table_name: "legal_pages",
        policy_name: "Admins can do everything with legal_pages",
      })

      if (dropPolicyError1) {
        console.error("Error dropping admin policy:", dropPolicyError1)
        // Continue anyway
      }

      const { error: dropPolicyError2 } = await supabase.rpc("drop_policy_if_exists", {
        table_name: "legal_pages",
        policy_name: "Anonymous users can select legal_pages",
      })

      if (dropPolicyError2) {
        console.error("Error dropping anon policy:", dropPolicyError2)
        // Continue anyway
      }

      // Create admin policy
      const { error: createAdminPolicyError } = await supabase.rpc("create_admin_policy", {
        table_name: "legal_pages",
      })

      if (createAdminPolicyError) {
        console.error("Error creating admin policy:", createAdminPolicyError)
        throw createAdminPolicyError
      }

      // Create anon policy
      const { error: createAnonPolicyError } = await supabase.rpc("create_anon_select_policy", {
        table_name: "legal_pages",
      })

      if (createAnonPolicyError) {
        console.error("Error creating anon policy:", createAnonPolicyError)
        throw createAnonPolicyError
      }

      setResult({
        success: true,
        message: "Legal pages RLS policies updated successfully!",
      })
    } catch (error) {
      console.error("Migration error:", error)
      setResult({
        success: false,
        message: `Error updating RLS policies: ${error.message}`,
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Fix Legal Pages Permissions</h3>
        <Button onClick={runMigration} disabled={isRunning} className="bg-white text-black hover:bg-white/90">
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            "Run Migration"
          )}
        </Button>
      </div>

      {result && (
        <Alert className={result.success ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}>
          <AlertDescription className={result.success ? "text-green-300" : "text-red-300"}>
            {result.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md bg-zinc-800/50 p-4">
        <p className="text-sm text-white/70">
          This will update the row-level security policies for the legal pages table to ensure that administrators can
          properly edit legal pages content.
        </p>
      </div>
    </div>
  )
}
