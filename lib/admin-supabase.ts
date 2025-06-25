import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key for admin operations
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('Environment check:', {
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    urlStart: supabaseUrl?.substring(0, 20) + '...',
    serviceKeyStart: supabaseServiceKey?.substring(0, 20) + '...'
  })

  if (!supabaseUrl || !supabaseServiceKey) {
    const error = new Error("Missing Supabase URL or service key. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
    console.error(error.message)
    throw error
  }

  try {
    const client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
    console.log('Admin client created successfully')
    return client
  } catch (error) {
    console.error('Failed to create admin client:', error)
    throw error
  }
}
