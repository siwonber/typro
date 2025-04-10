// src/lib/auth-helpers-react.ts

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

export function useSession() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hardcodedUserEmail = 'test@test.com'
    const hardcodedPassword = '123'


    const login = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: hardcodedUserEmail,
          password: hardcodedPassword
        })

        if (error) throw error
        setSession({ user: data.user })
      } catch (error) {
        console.log("Login failed", error)
      } finally {
        setLoading(false)
      }
    }

    login()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { session, loading }
}
