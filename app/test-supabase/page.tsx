"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"

export default function TestSupabasePage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [testLeadResult, setTestLeadResult] = useState<any>(null)
  const [testLeadError, setTestLeadError] = useState<string | null>(null)
  const [teamMembersResult, setTeamMembersResult] = useState<any>(null)
  const [teamMembersError, setTeamMembersError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<any>(null)

  // Test basic connection
  const testConnection = async () => {
    try {
      setError(null)
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      // Just try to get the count of leads
      const { data, error: supabaseError } = await supabase.from("leads").select("count")

      if (supabaseError) throw supabaseError

      setResult(data)
    } catch (err) {
      console.error("Connection test error:", err)
      setError(err.message || JSON.stringify(err))
    }
  }

  // Test inserting a test lead
  const testInsertLead = async () => {
    try {
      setTestLeadError(null)
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      // Create a test lead with timestamp to make it unique
      const testLead = {
        name: `Test User ${new Date().toISOString()}`,
        email: "test@example.com",
        phone: "+37012345678",
        interest: "test",
        status: "test",
      }

      const { data, error: supabaseError } = await supabase.from("leads").insert([testLead]).select()

      if (supabaseError) throw supabaseError

      setTestLeadResult(data)
    } catch (err) {
      console.error("Test lead insertion error:", err)
      setTestLeadError(err.message || JSON.stringify(err))
    }
  }

  // Test fetching team members
  const testFetchTeamMembers = async () => {
    try {
      setTeamMembersError(null)
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      const { data, error: supabaseError } = await supabase.from("team_members").select("*")

      if (supabaseError) throw supabaseError

      setTeamMembersResult(data)
    } catch (err) {
      console.error("Team members fetch error:", err)
      setTeamMembersError(err.message || JSON.stringify(err))
    }
  }

  // Check environment variables (public ones only)
  const checkEnvVars = () => {
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
      // We don't show SUPABASE_ANON_KEY as it's not accessible on the client
    })
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>

      <div className="mb-8 p-6 border border-gray-700 rounded-md bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Test Database Connection</h2>
        <Button onClick={testConnection} className="mb-4">
          Test Connection
        </Button>

        {error && (
          <div className="p-4 mb-4 bg-red-900/30 border border-red-700 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">Error:</h3>
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-900/30 border border-green-700 rounded-md">
            <h3 className="font-medium text-green-400 mb-2">Success:</h3>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="mb-8 p-6 border border-gray-700 rounded-md bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Test Lead Insertion</h2>
        <Button onClick={testInsertLead} className="mb-4">
          Insert Test Lead
        </Button>

        {testLeadError && (
          <div className="p-4 mb-4 bg-red-900/30 border border-red-700 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">Error:</h3>
            <pre className="whitespace-pre-wrap text-sm">{testLeadError}</pre>
          </div>
        )}

        {testLeadResult && (
          <div className="p-4 bg-green-900/30 border border-green-700 rounded-md">
            <h3 className="font-medium text-green-400 mb-2">Success:</h3>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(testLeadResult, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="mb-8 p-6 border border-gray-700 rounded-md bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Test Team Members Fetch</h2>
        <Button onClick={testFetchTeamMembers} className="mb-4">
          Fetch Team Members
        </Button>

        {teamMembersError && (
          <div className="p-4 mb-4 bg-red-900/30 border border-red-700 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">Error:</h3>
            <pre className="whitespace-pre-wrap text-sm">{teamMembersError}</pre>
          </div>
        )}

        {teamMembersResult && (
          <div className="p-4 bg-green-900/30 border border-green-700 rounded-md">
            <h3 className="font-medium text-green-400 mb-2">Success:</h3>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(teamMembersResult, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="p-6 border border-gray-700 rounded-md bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Check Environment Variables</h2>
        <Button onClick={checkEnvVars} className="mb-4">
          Check Environment Variables
        </Button>

        {envVars && (
          <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-md">
            <h3 className="font-medium text-blue-400 mb-2">Environment Variables:</h3>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(envVars, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
