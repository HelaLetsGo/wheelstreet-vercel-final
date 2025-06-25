import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Re-export createClient from Supabase
export { createClient } from "@supabase/supabase-js"

// Create a Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to get a client component client
export function getSupabaseClient() {
  return createClientComponentClient()
}

// Helper function to check if Supabase is configured
export function isSupabaseConfigured() {
  return supabaseUrl !== "" && supabaseKey !== ""
}
