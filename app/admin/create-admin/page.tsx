"use client"

export const dynamic = 'force-dynamic'

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"

export default function CreateAdminPage() {
  const [email, setEmail] = useState("admin@test.com")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables')
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseKey)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      setResult(data)
    } catch (err) {
      console.error("Error creating user:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-4">
      <Card className="w-full max-w-md border-white/10 bg-zinc-900/80 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">Create Admin User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/20 bg-black/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/20 bg-black/30"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-white text-black hover:bg-white/90" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Admin User"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 rounded-md bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-300">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 rounded-md bg-green-500/10 border border-green-500/30 p-4 text-sm text-green-300">
              <p className="font-medium">Success!</p>
              <p>Admin user created successfully.</p>
              <p className="mt-2">
                You can now{" "}
                <a href="/admin/login" className="underline">
                  log in
                </a>{" "}
                with these credentials.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
