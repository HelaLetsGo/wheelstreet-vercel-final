"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Check, AlertTriangle } from "lucide-react"

export default function RunMigration() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const runMigration = async () => {
    try {
      setIsRunning(true)
      setResult(null)

      // Add image_path column to service_tabs table
      const { error: alterError } = await supabase.rpc("run_sql", {
        query: "ALTER TABLE service_tabs ADD COLUMN IF NOT EXISTS image_path VARCHAR;",
      })

      if (alterError) throw alterError

      // Update existing rows with default value if needed
      const { error: updateError } = await supabase.rpc("run_sql", {
        query: "UPDATE service_tabs SET image_path = '' WHERE image_path IS NULL;",
      })

      if (updateError) throw updateError

      setResult({
        success: true,
        message:
          "Migration completed successfully. The 'image_path' column has been added to the 'service_tabs' table.",
      })
    } catch (error) {
      console.error("Migration error:", error)
      setResult({
        success: false,
        message: `Migration failed: ${error.message || "Unknown error"}`,
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card className="border-white/10 bg-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Database Migration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-white/80">
          This will add the 'image_path' column to the 'service_tabs' table in the database.
        </p>

        <Button onClick={runMigration} disabled={isRunning} className="bg-white text-black hover:bg-white/90">
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Migration...
            </>
          ) : (
            "Run Migration"
          )}
        </Button>

        {result && (
          <Alert
            className={cn(
              "mt-4",
              result.success ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10",
            )}
          >
            {result.success ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-400" />
            )}
            <AlertDescription className={result.success ? "text-green-300" : "text-red-300"}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
