import { useState } from 'react'
import { apiFetch } from '../lib/api'

export default function Chat() {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setAnswer('')

    try {
      const { text } = await apiFetch('/api/generate', { method: 'POST', body: { prompt } })
      setAnswer(text)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <textarea
          rows={4}
          placeholder="Ask Gemini something…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <button type="submit" disabled={busy || !prompt.trim()}>
          {busy ? 'Thinking…' : 'Send'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {answer && <div className="output">{answer}</div>}
    </>
  )
}
