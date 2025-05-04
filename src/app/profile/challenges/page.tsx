'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function OverviewPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session?.user) {
          throw new Error('No user session found')
        }

        const userId = session.user.id

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) {
          console.error('❌ profile fetch error', error)
          throw error
        }

        console.log('📄 profile data', data)
        setProfile(data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <p>Loading...</p>
  if (!profile) return <p>Profile not found.</p>

  return (
    <div>
      <h1>{profile.username}</h1>
      <p>{profile.email}</p>
    </div>
  )
}
