'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthSwitcher() {
  const [isLogin, setIsLogin] = useState(true)
  const [identifier, setIdentifier] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    let email = identifier

    if (isLogin) {
      if (!identifier.includes('@')) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single()

        if (error || !profile) {
          setError('Username not found')
          setLoading(false)
          return
        }

        email = profile.email
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) {
        setError(loginError.message)
        setLoading(false)
        return
      }

      router.replace('/home')
    } else {
      if (username.length < 3) {
        setError('Username too short')
        setLoading(false)
        return
      }

      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

        if (existingUsername?.id) {
          setError('Username already taken')
          setLoading(false)
          return
        }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: identifier,
        password,
      })

      if (signUpError || !signUpData.user) {
        setError(signUpError?.message || 'Sign up failed')
        setLoading(false)
        return
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getUser()
      const uid = sessionData.user?.id
      if (!uid || sessionError) {
        setError('Session not found after signup')
        setLoading(false)
        return
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: uid,
        username,
        email: identifier,
        avatar_url: '',
        rank_solo: 'Bronze',
        rank_duo: 'Bronze',
        rank_tournament: 'Bronze',
        is_online: true,
      })

      if (profileError) {
        setError(`Profile creation failed: ${profileError.message}`)
        setLoading(false)
        return
      }

      router.replace('/home')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 items-center text-center bg-surface px-6 py-10 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h1>
      <input
        type="text"
        placeholder={isLogin ? 'Email' : 'Email'}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="w-full max-w-xs px-4 py-2 border rounded"
      />
      {!isLogin && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border rounded"
        />
      )}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-xs px-4 py-2 border rounded"
      />
      {error && <p className="text-error text-sm">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-primary text-white px-6 py-2 rounded hover:opacity-80 w-full max-w-xs"
      >
        {loading ? (isLogin ? 'Logging in...' : 'Creating...') : isLogin ? 'Login' : 'Sign Up'}
      </button>
      <p className="text-sm text-muted">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <button className="text-accent underline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  )
}
