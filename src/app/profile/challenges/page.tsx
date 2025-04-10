'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function OverviewPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Abrufen der Profildaten des Benutzers
        const { data, error } = await supabase.from('profiles').select('*').single()

        if (error) {
          // Zeigt den detaillierten Fehler an
          console.error('❌ profile fetch error', error)
          throw error
        }

        console.log('📄 profile data', data)

        if (data) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!profile) {
    return <p>Profile not found.</p>
  }

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.email}</p>
    </div>
  )
}
