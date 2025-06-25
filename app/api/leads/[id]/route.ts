import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PUT /api/leads/[id] - Starting request')
    
    const body = await request.json()
    const { name, email, phone, interest, status, notes, message, team_member_id } = body
    const resolvedParams = await params
    const leadId = resolvedParams.id

    console.log('PUT request data:', { leadId, body })

    // If this is a partial update (only notes, status, or team_member_id), don't require name/phone
    const isPartialUpdate = Object.keys(body).length <= 3 && (body.notes !== undefined || body.status !== undefined || body.team_member_id !== undefined)
    
    if (!isPartialUpdate && (!name || !phone)) {
      console.log('Validation failed: missing name or phone')
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      )
    }

    console.log('Creating Supabase client...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration" },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase client created successfully')

    // First check if the lead exists
    console.log('Checking if lead exists...')
    const { data: existingLead, error: findError } = await supabase
      .from("leads")
      .select("id")
      .eq("id", leadId)
      .single()

    console.log('Lead lookup result:', { existingLead, findError })

    if (findError || !existingLead) {
      console.error("Lead not found:", findError)
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    console.log('Updating lead...')
    
    // Build update object dynamically based on what fields are provided
    const updateObject: any = {}
    if (name !== undefined) updateObject.name = name
    if (email !== undefined) updateObject.email = email || null
    if (phone !== undefined) updateObject.phone = phone
    if (interest !== undefined) updateObject.interest = interest || null
    if (status !== undefined) updateObject.status = status
    if (notes !== undefined) updateObject.notes = notes || null
    if (message !== undefined) updateObject.message = message || null
    if (team_member_id !== undefined) updateObject.team_member_id = team_member_id || null
    
    const { data, error } = await supabase
      .from("leads")
      .update(updateObject)
      .eq("id", leadId)
      .select()

    console.log('Update result:', { data, error })

    if (error) {
      console.error("Error updating lead:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      console.error("No data returned after update")
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    console.log('Update successful:', data[0])
    return NextResponse.json({ lead: data[0] })
  } catch (error) {
    console.error("Unexpected error in PUT /api/leads/[id]:", error)
    return NextResponse.json({ 
      error: "An unexpected error occurred", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const leadId = resolvedParams.id
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration" },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", leadId)

    if (error) {
      console.error("Error deleting lead:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Lead deleted successfully" })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}