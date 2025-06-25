import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if environment variables are set
    const envStatus = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      ADMIN_SECRET_KEY: !!process.env.ADMIN_SECRET_KEY,
      // Add first few characters of each key for debugging (don't expose full keys)
      NEXT_PUBLIC_SUPABASE_URL_PREFIX: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) + "...",
      SUPABASE_SERVICE_ROLE_KEY_PREFIX: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) + "...",
      SUPABASE_ANON_KEY_PREFIX: process.env.SUPABASE_ANON_KEY?.substring(0, 10) + "...",
      ADMIN_SECRET_KEY_PREFIX: process.env.ADMIN_SECRET_KEY?.substring(0, 10) + "...",
    }

    return NextResponse.json({ envStatus })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
