'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type SidebarProps = {
  setActive: (val: 'profile' | 'news') => void
}

export default function Sidebar({ setActive }: SidebarProps) {
  const [username, setUsername] = useState('...')
  const [avatarUrl, setAvatarUrl] = useState('/images/profile/avatar.png')
  const [isOnline, setIsOnline] = useState(false)

  const online = ['mario', 'adri', 'ChrizzyConstanze']
  const offline = ['marcusAurelius', 'tibruh', 'gina']

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const uid = session?.user?.id
      if (!uid) return

      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, is_online')
        .eq('id', uid)
        .single()

      if (data) {
        setUsername(data.username || 'Unknown')
        setAvatarUrl(data.avatar_url || '/images/profile/avatar.png')
        setIsOnline(data.is_online)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="h-full w-[280px] bg-surface border-l border-muted p-6 flex flex-col gap-6 text-sm text-text">
      {/* Profil */}
      <Link
        href="/profile/overview"
        className="flex items-center gap-4 cursor-pointer hover:opacity-90"
      >
        <Image
          src={avatarUrl}
          alt="Profil"
          width={64}
          height={64}
          className="rounded-full border-2 border-primary object-cover"
        />
        <div>
          <p className="font-bold text-base">{username}</p>
          <p className={`text-xs ${isOnline ? 'text-success' : 'text-muted'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </Link>

      {/* Online Friends */}
      <div>
        <h4 className="text-primary font-semibold mb-1">Online</h4>
        <div className="flex flex-col gap-1">
          {online.map((name) => (
            <div key={name} className="px-3 py-1 rounded bg-background/60">
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Offline Friends */}
      <div>
        <h4 className="text-muted font-semibold mb-1">Offline</h4>
        <div className="flex flex-col gap-1 text-muted">
          {offline.map((name) => (
            <div key={name} className="px-3 py-1 rounded bg-background/20">
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
