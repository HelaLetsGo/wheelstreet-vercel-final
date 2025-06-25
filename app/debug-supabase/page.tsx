"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"

export default function DebugSupabasePage() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [connectionTest, setConnectionTest] = useState<string>("Testing...")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      console.log("=== SUPABASE DEBUG DIAGNOSTICS ===")
      
      // Check environment variables
      const envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET (length: " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ")" : "NOT SET",
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV
      }
      
      console.log("Environment Variables:", envVars)
      
      let clientTest = "Failed to create client"
      let connectionResult = "Connection failed"
      let authTest = "Auth test failed"
      let tablesTest = "Tables test failed"
      
      try {
        // Test client creation
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          )
          clientTest = "✅ Client created successfully"
          console.log("✅ Supabase client created")
          
          // Test basic connection
          try {
            const { data, error } = await supabase.from("leads").select("count", { count: "exact", head: true })
            if (error) {
              connectionResult = `❌ Connection error: ${error.message}`
              console.error("Connection error:", error)
            } else {
              connectionResult = `✅ Connection successful. Leads count: ${data?.length || 0}`
              console.log("✅ Connection successful")
              
              // Test form insertion
              try {
                const testLead = {
                  name: "Debug Test User",
                  email: "debug@test.com",
                  phone: "+37061234567",
                  interest: "debug",
                  message: "Debug test from browser",
                  status: "new"
                }
                
                const { data: insertData, error: insertError } = await supabase
                  .from("leads")
                  .insert([testLead])
                  .select()
                  
                if (insertError) {
                  connectionResult += ` | ❌ Insert test failed: ${insertError.message}`
                } else {
                  connectionResult += ` | ✅ Insert test successful`
                  
                  // Clean up test data
                  if (insertData?.[0]?.id) {
                    await supabase.from("leads").delete().eq("id", insertData[0].id)
                  }
                }
              } catch (insertErr) {
                connectionResult += ` | ❌ Insert test exception: ${insertErr.message}`
              }
            }
          } catch (err) {
            connectionResult = `❌ Connection exception: ${err.message}`
            console.error("Connection exception:", err)
          }
          
          // Test auth
          try {
            const { data: { session }, error: authError } = await supabase.auth.getSession()
            if (authError) {
              authTest = `❌ Auth error: ${authError.message}`
            } else {
              authTest = session ? `✅ User logged in: ${session.user?.email}` : "✅ Auth working (no session)"
            }
          } catch (err) {
            authTest = `❌ Auth exception: ${err.message}`
          }
          
          // Test tables access
          try {
            const { data: leadsData } = await supabase.from("leads").select("id").limit(1)
            const { data: teamData } = await supabase.from("team_members").select("id").limit(1)
            const { data: sectionsData } = await supabase.from("page_sections").select("id").limit(1)
            
            tablesTest = `✅ Tables accessible: leads(${leadsData?.length || 0}), team_members(${teamData?.length || 0}), page_sections(${sectionsData?.length || 0})`
          } catch (err) {
            tablesTest = `❌ Tables error: ${err.message}`
          }
          
        } else {
          clientTest = "❌ Missing environment variables"
          connectionResult = "❌ Cannot test - missing env vars"
        }
      } catch (err) {
        clientTest = `❌ Client creation failed: ${err.message}`
        console.error("Client creation error:", err)
      }
      
      const debug = {
        timestamp: new Date().toISOString(),
        environment: envVars,
        clientCreation: clientTest,
        connection: connectionResult,
        auth: authTest,
        tables: tablesTest,
        userAgent: navigator.userAgent,
        location: window.location.href
      }
      
      console.log("=== DEBUG RESULTS ===", debug)
      setDebugInfo(debug)
      setConnectionTest(connectionResult)
      setLoading(false)
    }
    
    runDiagnostics()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔍 Supabase Debug Dashboard</h1>
        
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Running diagnostics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Status */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🚦 Quick Status</h2>
              <div className="text-lg font-mono">
                {connectionTest}
              </div>
            </div>
            
            {/* Environment Variables */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🌍 Environment Variables</h2>
              <div className="space-y-2 font-mono text-sm">
                {Object.entries(debugInfo.environment || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-blue-400">{key}:</span>
                    <span className={value === "NOT SET" ? "text-red-400" : "text-green-400"}>
                      {value || "undefined"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Test Results */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🧪 Test Results</h2>
              <div className="space-y-3">
                <div className="font-mono text-sm">
                  <strong>Client Creation:</strong> {debugInfo.clientCreation}
                </div>
                <div className="font-mono text-sm">
                  <strong>Connection:</strong> {debugInfo.connection}
                </div>
                <div className="font-mono text-sm">
                  <strong>Auth:</strong> {debugInfo.auth}
                </div>
                <div className="font-mono text-sm">
                  <strong>Tables:</strong> {debugInfo.tables}
                </div>
              </div>
            </div>
            
            {/* System Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">💻 System Info</h2>
              <div className="space-y-2 font-mono text-sm">
                <div><strong>Timestamp:</strong> {debugInfo.timestamp}</div>
                <div><strong>Location:</strong> {debugInfo.location}</div>
                <div><strong>User Agent:</strong> {debugInfo.userAgent}</div>
              </div>
            </div>
            
            {/* Raw Debug Object */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📋 Raw Debug Data</h2>
              <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}