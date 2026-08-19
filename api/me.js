import { getUser } from './_lib/supabase.js'

export default async function handler(req, res) {
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  res.status(200).json({ id: user.id, email: user.email })
}
