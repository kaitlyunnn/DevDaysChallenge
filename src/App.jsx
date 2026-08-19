import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth.jsx'
import Chat from './components/Chat.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  if (loading) return <main>Loading…</main>

  return (
    <main>
      <h1>Boilerplate</h1>
      {!session ? (
        <Auth />
      ) : (
        <>
          <div className="row">
            <span>Signed in as {session.user.email}</span>
            <button onClick={() => supabase.auth.signOut()}>Sign out</button>
          </div>
          <Chat />
        </>
      )}
    </main>
  )
}
