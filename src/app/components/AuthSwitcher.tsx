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

    let email = identifier.trim().toLowerCase()
    const cleanUsername = username.trim()

    if (isLogin) {
      // Check if user typed a username instead of email
      if (!email.includes('@')) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', email)
          .single()

        if (error || !profile?.email) {
          setError('❌ Username not found')
          setLoading(false)
          return
        }

        email = profile.email
      }

      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password })

      if (loginError || !loginData.user) {
        setError('❌ ' + (loginError?.message ?? 'Unknown error'))
        setLoading(false)
        return
      }

      // ✅ Mark user as online
      await supabase
        .from('profiles')
        .update({ is_online: true })
        .eq('id', loginData.user.id)

      router.replace('/home')
    } else {
      if (cleanUsername.length < 3) {
        setError('Username too short')
        setLoading(false)
        return
      }

      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', cleanUsername)
        .single()

      if (existingUsername) {
        setError('Username already taken')
        setLoading(false)
        return
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError || !signUpData.user) {
        setError(signUpError?.message || 'Sign up failed')
        setLoading(false)
        return
      }

      const userId = signUpData.user.id

      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        username: cleanUsername,
        email,
        avatar_url: '/images/profile/avatar.png',
        rank_solo: 'bronze',
        rank_duo: 'bronze',
        rank_tournament: 'bronze',
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
        placeholder={isLogin ? 'Email or Username' : 'Email'}
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
