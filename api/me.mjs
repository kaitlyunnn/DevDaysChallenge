import { applyCors } from './_lib/http.mjs'
import { getUser } from './_lib/supabase.mjs'

export default async function handler(req, res) {
  if (applyCors(req, res)) return

  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  res.status(200).json({ id: user.id, email: user.email })
}
