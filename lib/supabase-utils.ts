import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Safely updates a record in Supabase using upsert with conflict handling
 *
 * @param tableName The name of the table to update
 * @param id The ID of the record to update
 * @param data The data to update
 * @param additionalFields Additional fields to include in the upsert
 * @param supabaseClient Optional Supabase client (will create one if not provided)
 * @returns The result of the upsert operation
 */
export async function safeUpsert(
  tableName: string,
  id: string,
  data: Record<string, any>,
  additionalFields: Record<string, any> = {},
  supabaseClient?: SupabaseClient,
) {
  const supabase = supabaseClient || createClientComponentClient()

  try {
    // Create the upsert data with the ID and additional fields
    const upsertData = {
      id,
      ...data,
      ...additionalFields,
    }

    // Use upsert with onConflict to ensure proper update
    const result = await supabase.from(tableName).upsert(upsertData, {
      onConflict: "id",
      returning: "minimal",
    })

    return result
  } catch (error) {
    console.error(`Error upserting to ${tableName}:`, error)
    throw error
  }
}

/**
 * Updates a record's timestamp fields
 *
 * @param data The data object to update
 * @param isNew Whether this is a new record (to set created_at)
 * @returns The data with updated timestamps
 */
export function withTimestamps(data: Record<string, any>, isNew = false) {
  const now = new Date().toISOString()

  return {
    ...data,
    updated_at: now,
    ...(isNew ? { created_at: now } : {}),
  }
}
