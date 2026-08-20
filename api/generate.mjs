import { DEFAULT_MODEL, generateWithRetry } from './_lib/gemini.mjs'
import { applyCors } from './_lib/http.mjs'
import { getUser, supabaseAdmin } from './_lib/supabase.mjs'

export default async function handler(req, res) {
  if (applyCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { prompt } = req.body || {}
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'prompt is required' })
  }

  try {
    const response = await generateWithRetry({ model: DEFAULT_MODEL, contents: prompt })
    const text = response.text

    // Example of writing to Postgres. Drop this block if you don't need history.
    const { error } = await supabaseAdmin
      .from('messages')
      .insert({ user_id: user.id, prompt, response: text })
    if (error) console.error('Failed to persist message:', error.message)

    res.status(200).json({ text })
  } catch (err) {
    console.error(err)

    // Distinguish "Gemini is busy, try again" from a real fault, so the UI can
    // say something more useful than a generic failure.
    if (err?.status === 429 || err?.status === 503) {
      return res.status(503).json({ error: 'Gemini is busy right now — try again in a moment.' })
    }
    res.status(500).json({ error: 'Generation failed' })
  }
}
