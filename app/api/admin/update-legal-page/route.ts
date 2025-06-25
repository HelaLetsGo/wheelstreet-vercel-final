import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { message: "Missing Supabase configuration. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse the request body
    const { id, title, content, page_type, is_active } = await request.json()

    if (!id || !title || !content || !page_type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Update the legal page
    const { error } = await supabase
      .from("legal_pages")
      .update({
        title,
        content,
        page_type,
        is_active: is_active !== undefined ? is_active : true,
        last_updated: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating legal page:", error)
      return NextResponse.json({ message: `Error updating legal page: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ message: `Unexpected error: ${error.message}` }, { status: 500 })
  }
}
