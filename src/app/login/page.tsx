'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { createProfileIfNotExists } from '@/lib/createProfileIfNotExists'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('test@test.com')
  const [password, setPassword] = useState('123')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      await createProfileIfNotExists() 
      router.push('/')
    }

    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/')
    })
  }, [router])

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-surface text-text">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="mb-2 px-4 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="mb-2 px-4 py-2 border rounded"
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded hover:opacity-80"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-error mt-2">{error}</p>}
    </main>
  )
}
