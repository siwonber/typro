'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'

type Rank = 'bronze' | 'silver' | 'gold' | 'platin' | 'diamond' | 'challenger'

interface Profile {
  username: string
  rank_solo: Rank
  rank_duo: Rank
  rank_tournament: Rank
}

export default function OverviewPage() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
  
      console.log('👤 user', user)
      if (userError) console.error('❌ getUser error', userError)
      if (!user) return
  
      const { data, error } = await supabase
        .from('profiles')
        .select('username, rank_solo, rank_duo, rank_tournament')
        .eq('id', user.id)
        .single()
  
      console.log('📄 profile data', data)
      if (error) console.error('❌ profile fetch error', error)
  
      if (data) setProfile(data)
    }
  
    fetchProfile()
  }, [])
  

  const getRankImage = (rank: Rank) =>
    `/images/ranks/${rank.toLowerCase()}.webp`

  if (!profile) {
    return <div className="text-muted text-center mt-20">Loading profile...</div>
  }

  return (
    <div className="p-6 text-text max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-8">Your Ranks</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-center items-center">
        <RankCard label="Solo" rank={profile.rank_solo} image={getRankImage(profile.rank_solo)} />
        <RankCard label="Duo" rank={profile.rank_duo} image={getRankImage(profile.rank_duo)} />
        <RankCard label="Tournament" rank={profile.rank_tournament} image={getRankImage(profile.rank_tournament)} />
      </div>
    </div>
  )
}

function RankCard({ label, rank, image }: { label: string; rank: string; image: string }) {
  return (
    <div className="bg-surface rounded-lg shadow-md p-4 flex flex-col items-center">
      <img src={image} alt={rank} className="w-20 h-20 mb-4" />
      <h3 className="text-xl font-semibold">{label} Rank</h3>
      <p className="text-muted capitalize">{rank}</p>
    </div>
  )
}
