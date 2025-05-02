'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import SettingsModal from './SettingsModal'
import AddFriendModal from './AddFriendModal'
import { Cog6ToothIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { getFriends } from '../hooks/friends'

type SidebarProps = {
  setActive: (val: 'profile' | 'news') => void
}

export default function Sidebar({ setActive }: SidebarProps) {
  const [username, setUsername] = useState('...')
  const [avatarUrl, setAvatarUrl] = useState('/images/profile/avatar.png')
  const [isOnline, setIsOnline] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAddFriend, setShowAddFriend] = useState(false)

  const [onlineFriends, setOnlineFriends] = useState<string[]>([])
  const [offlineFriends, setOfflineFriends] = useState<string[]>([])

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const uid = session?.user?.id
      if (!uid) return

      const { data } = await supabase
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

    const fetchFriendList = async () => {
      try {
        const data = await getFriends()
        const online = data.filter((f) => f.profiles?.is_online).map((f) => f.profiles.username)
        const offline = data.filter((f) => !f.profiles?.is_online).map((f) => f.profiles.username)
        setOnlineFriends(online)
        setOfflineFriends(offline)
      } catch (err) {
        console.error('Could not load friends:', err)
      }
    }

    fetchProfile()
    fetchFriendList()
  }, [])

  return (
    <div className="h-full w-[280px] bg-surface border-l border-muted p-6 flex flex-col gap-6 text-sm text-text">
      {/* Profile */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile/overview"
          className="flex items-center gap-4 cursor-pointer hover:opacity-90"
        >
          <Image
            src={avatarUrl}
            alt="Profile"
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
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(true)} className="p-1 text-muted hover:text-text">
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setShowAddFriend(true)} className="p-1 text-muted hover:text-text">
            <UserPlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Online Friends */}
      <div>
        <h4 className="text-primary font-semibold mb-1">Online</h4>
        <div className="flex flex-col gap-1">
          {onlineFriends.length === 0 && <p className="text-muted text-xs">No one online</p>}
          {onlineFriends.map((name) => (
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
          {offlineFriends.length === 0 && <p className="text-xs">No friends offline</p>}
          {offlineFriends.map((name) => (
            <div key={name} className="px-3 py-1 rounded bg-background/20">
              {name}
            </div>
          ))}
        </div>
      </div>

      {showSettings && (
        <SettingsModal
          currentAvatar={avatarUrl}
          onClose={() => setShowSettings(false)}
          onAvatarUpdate={(url) => setAvatarUrl(url)}
        />
      )}

      {showAddFriend && (
        <AddFriendModal onClose={() => setShowAddFriend(false)} />
      )}
    </div>
  )
}
