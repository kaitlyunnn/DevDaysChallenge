import { ai, DEFAULT_MODEL } from './_lib/gemini.js'
import { getUser, supabaseAdmin } from './_lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { prompt } = req.body || {}
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'prompt is required' })
  }

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    })
    const text = response.text

    // Example of writing to Postgres. Drop this block if you don't need history.
    const { error } = await supabaseAdmin
      .from('messages')
      .insert({ user_id: user.id, prompt, response: text })
    if (error) console.error('Failed to persist message:', error.message)

    res.status(200).json({ text })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Generation failed' })
  }
}
