import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const teamMember = await request.json()

    if (!teamMember) {
      return NextResponse.json({ error: "Team member data is required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate a URL-friendly member_id from name if not already set
    if (!teamMember.member_id) {
      teamMember.member_id = teamMember.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }

    // Filter out empty bio paragraphs
    if (teamMember.bio) {
      const filteredBio = teamMember.bio.filter((paragraph: string) => paragraph.trim() !== "")
      teamMember.bio = filteredBio.length > 0 ? filteredBio : [""]
    }

    // Add timestamps
    const now = new Date().toISOString()
    if (teamMember.id) {
      // Update existing member
      teamMember.updated_at = now

      const { data, error } = await supabase.from("team_members").update(teamMember).eq("id", teamMember.id).select()

      if (error) {
        console.error("Error updating team member:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, teamMember: data[0] })
    } else {
      // Create new member
      teamMember.created_at = now
      teamMember.updated_at = now

      const { data, error } = await supabase.from("team_members").insert([teamMember]).select()

      if (error) {
        console.error("Error creating team member:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, teamMember: data[0] })
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
