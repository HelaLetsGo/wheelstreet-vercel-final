import { createAdminClient } from "@/lib/admin-supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log('Testing admin client...')
    const supabase = createAdminClient()
    console.log('Admin client created, testing database connection...')
    
    // Test simple query
    const { data, error } = await supabase
      .from("leads")
      .select("count")
      .limit(1)
    
    console.log('Test query result:', { data, error })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin client working',
      testResult: { data, error }
    })
  } catch (error) {
    console.error('Test admin client error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}