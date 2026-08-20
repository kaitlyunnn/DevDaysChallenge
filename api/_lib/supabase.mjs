import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const secretKey = process.env.SUPABASE_SECRET_KEY

/**
 * Admin client — bypasses Row Level Security. Server-side only.
 */
export const supabaseAdmin = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

/**
 * Reads the Bearer token off the request and resolves the Supabase user.
 * Returns null when there is no valid session.
 */
export async function getUser(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error) return null
  return data.user
}
