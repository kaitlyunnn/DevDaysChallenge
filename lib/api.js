import { Platform } from 'react-native'
import { supabase } from './supabase'

/**
 * Native builds have no origin to resolve relative URLs against, so they need
 * an absolute base pointing at the deployed functions. On web an empty base
 * keeps requests same-origin.
 */
const BASE = Platform.OS === 'web' ? '' : (process.env.EXPO_PUBLIC_API_URL ?? '')

if (Platform.OS !== 'web' && !BASE) {
  console.warn('EXPO_PUBLIC_API_URL is not set — /api calls will fail on device.')
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`)
  return json
}
