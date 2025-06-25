import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the table structure
    const { data: tableInfo, error: tableError } = await supabase.from("team_members").select("*").limit(1)

    if (tableError) {
      return NextResponse.json(
        { error: tableError.message, details: "Error fetching table structure" },
        { status: 500 },
      )
    }

    // Get all team members
    const { data: allMembers, error: membersError } = await supabase.from("team_members").select("*")

    if (membersError) {
      return NextResponse.json({ error: membersError.message, details: "Error fetching team members" }, { status: 500 })
    }

    // Get all leads
    const { data: allLeads, error: leadsError } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

    if (leadsError) {
      return NextResponse.json({ error: leadsError.message, details: "Error fetching leads" }, { status: 500 })
    }

    return NextResponse.json({
      tableStructure: tableInfo ? Object.keys(tableInfo[0] || {}) : [],
      totalMembers: allMembers ? allMembers.length : 0,
      totalLeads: allLeads ? allLeads.length : 0,
      sampleMember: allMembers && allMembers.length > 0 ? allMembers[0] : null,
      allMembers: allMembers || [],
      leads: allLeads || [],
      teamMembers: allMembers || [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
