import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const memberId = params.id

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY" },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.from("team_members").select("*").eq("member_id", memberId).single()

    if (error) {
      console.error("Error fetching team member:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process the data to ensure it has the correct format
    let contact = data.contact
    let bio = data.bio

    if (typeof contact === "string") {
      try {
        contact = JSON.parse(contact)
      } catch (e) {
        console.error("Error parsing contact JSON:", e)
        contact = {}
      }
    }

    if (typeof bio === "string" && bio.startsWith("[") && bio.endsWith("]")) {
      try {
        bio = JSON.parse(bio)
      } catch (e) {
        console.error("Error parsing bio JSON:", e)
        // Keep it as a string if it can't be parsed
      }
    }

    const processedData = {
      ...data,
      contact,
      bio,
    }

    return NextResponse.json({ teamMember: processedData })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
