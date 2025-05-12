'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@lib/supabaseClient'

export default function AuthSwitcher() {
  const [isLogin, setIsLogin] = useState(true)
  const [identifier, setIdentifier] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getPasswordStrength = (pw: string) => {
    if (pw.length < 6) return 'weak'
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) return 'strong'
    if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) return 'medium'
    return 'weak'
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    let email = identifier.trim().toLowerCase()
    const cleanUsername = username.trim()

    if (isLogin) {
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

      await supabase.from('profiles').update({ is_online: true }).eq('id', loginData.user.id)
      router.replace('/home')
    } else {
      if (identifier && (!email.includes('@') || !email.includes('.'))) {
        setError('Invalid email format')
        setLoading(false)
        return
      }

      if (cleanUsername.length < 3) {
        setError('Username must be at least 3 characters')
        setLoading(false)
        return
      }

      const { data: existingUsername, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', cleanUsername)
        .maybeSingle()

      if (checkError) {
        console.error('Username check error:', checkError)
        setError('❌ Failed to check username')
        setLoading(false)
        return
      }

      if (existingUsername) {
        setError('Username already taken')
        setLoading(false)
        return
      }

      const { error: signUpError } = await supabase.auth.signUp({ email, password })

      if (signUpError) {
        console.error('SIGNUP ERROR:', signUpError)
        setError(`❌ Signup failed: ${signUpError.message}`)
        setLoading(false)
        return
      }

      let user = null
      for (let i = 0; i < 10; i++) {
        const { data } = await supabase.auth.getUser()
        if (data?.user) {
          user = data.user
          break
        }
        await new Promise((res) => setTimeout(res, 300))
      }

      if (!user) {
        setError('❌ User session not available')
        setLoading(false)
        return
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        username: cleanUsername,
        email,
        avatar_url: '/images/profile/avatar1.3.png',
        rank_solo: 'bronze',
        rank_duo: 'bronze',
        rank_tournament: 'bronze',
        is_online: true,
      })

      if (profileError) {
        console.error('INSERT ERROR:', profileError)
        setError(`❌ Profile creation failed: ${profileError.message}`)
        setLoading(false)
        return
      }

      router.replace('/home')
    }

    setLoading(false)
  }

  const pwStrength = getPasswordStrength(password)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="flex flex-col gap-4 items-center text-center bg-surface px-6 py-10 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h1>
      <input
        type="text"
        placeholder={isLogin ? 'Email or Username' : 'Email'}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full max-w-xs px-4 py-2 border rounded bg-black/10 text-white placeholder:text-muted"
      />
      {!isLogin && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full max-w-xs px-4 py-2 border rounded bg-black/10 text-white placeholder:text-muted"
        />
      )}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full max-w-xs px-4 py-2 border rounded bg-black/10 text-white placeholder:text-muted"
      />
      {!isLogin && password.length > 0 && (
        <p
          className={`text-sm ${
            pwStrength === 'weak' ? 'text-error' : pwStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'
          }`}
        >
          Password strength: {pwStrength}
        </p>
      )}
      {error && <p className="text-error text-sm">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-primary text-white px-6 py-2 rounded hover:opacity-80 w-full max-w-xs"
      >
        {loading ? (isLogin ? 'Logging in...' : 'Creating...') : isLogin ? 'Login' : 'Sign Up'}
      </button>
      <p className="text-sm text-muted">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button className="text-accent underline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  )
}
