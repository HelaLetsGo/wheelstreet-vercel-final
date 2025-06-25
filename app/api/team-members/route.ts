import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY" },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.from("team_members").select("*").order("name")

    if (error) {
      console.error("Error fetching team members:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process the data to ensure it has the correct format
    const processedData = data.map((member) => {
      // Parse JSON fields if they're stored as strings
      let contact = member.contact
      let bio = member.bio

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

      return {
        ...member,
        contact,
        bio,
      }
    })

    return NextResponse.json({ teamMembers: processedData })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
