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

    if (isLogin) {
      let email = identifier

      if (!identifier.includes('@')) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', identifier)
          .single()

        if (!data || error) {
          setError('Username not found')
          setLoading(false)
          return
        }

        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(data.id)
        if (!userData || !userData.user?.email || userError) {
          setError('No account linked to that username')
          setLoading(false)
          return
        }

        email = userData.user.email
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/home')
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

      if (existingUsername) {
        setError('Username already taken')
        setLoading(false)
        return
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: identifier,
        password,
      })

      if (signUpError || !data.user) {
        setError(signUpError?.message || 'Sign up failed')
        setLoading(false)
        return
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,  
        username,
      })

      if (profileError) {
        setError(`Profile creation failed: ${profileError.message}`)
        setLoading(false)
        return
      }

      router.push('/home')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 items-center text-center bg-surface px-6 py-10 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>

      <input
        type="text"
        placeholder={isLogin ? 'Username or Email' : 'Email'}
        value={identifier}
        onChange={e => setIdentifier(e.target.value)}
        className="w-full max-w-xs px-4 py-2 border rounded"
      />

      {!isLogin && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border rounded"
        />
      )}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full max-w-xs px-4 py-2 border rounded"
      />

      {error && <p className="text-error text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-primary text-white px-6 py-2 rounded hover:opacity-80 w-full max-w-xs"
      >
        {loading ? (isLogin ? 'Logging in...' : 'Creating...') : (isLogin ? 'Login' : 'Sign Up')}
      </button>

      <p className="text-sm text-muted">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <button
          className="text-accent underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  )
}
