import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handle(mode, e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setStatus(null)

    const fn = mode === 'signup' ? supabase.auth.signUp : supabase.auth.signInWithPassword
    const { error } = await fn.call(supabase.auth, { email, password })

    if (error) setError(error.message)
    else if (mode === 'signup') setStatus('Check your email to confirm your account.')

    setBusy(false)
  }

  return (
    <form onSubmit={(e) => handle('signin', e)}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="row">
        <button type="submit" disabled={busy}>Sign in</button>
        <button type="button" disabled={busy} onClick={(e) => handle('signup', e)}>
          Sign up
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {status && <p>{status}</p>}
    </form>
  )
}
