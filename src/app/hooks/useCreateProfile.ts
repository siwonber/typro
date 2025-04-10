'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function useCreateProfile() {
  useEffect(() => {
    const createProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!data && !error) {
        await supabase.from('profiles').insert({
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
        })
      }
    }

    createProfile()
  }, [])
}
