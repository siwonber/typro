'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import useSession from './hooks/useSession'
import AuthSwitcher from './components/AuthSwitcher'

export default function Home() {
  const { session, loading } = useSession()
  const [username, setUsername] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user) return
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single()

      if (data?.username) setUsername(data.username)
    }

    fetchUser()
  }, [session])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return <div className="text-center mt-40 text-muted">Loading...</div>
  if (!session) return (
    <main className="flex flex-col items-center justify-center h-screen text-text bg-background">
      <AuthSwitcher />
    </main>
  )

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-text)] px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome <span className="text-primary">{username || 'Champion'}</span>
      </h1>
      <p className="text-muted mb-8">You are now logged in. More coming soon…</p>
      <button
        onClick={handleLogout}
        className="bg-error hover:bg-red-600 text-white font-semibold py-2 px-6 rounded transition"
      >
        Logout
      </button>
    </div>
  )
}
