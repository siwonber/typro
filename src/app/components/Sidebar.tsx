'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'
import SettingsModal from './SettingsModal'
import AddFriendModal from './AddFriendModal'
import FriendRequestsModal from './FriendRequestsModal'
import { Cog6ToothIcon, UserPlusIcon, BellIcon } from '@heroicons/react/24/outline'
import { getFriends, getIncomingRequests, acceptFriendRequest } from '../hooks/friends'
import type { FriendRequest, FriendProfile } from '../hooks/friends'

type SidebarProps = {
  setActive: (val: 'profile' | 'news') => void
}

export default function Sidebar({ setActive }: SidebarProps) {
  const [username, setUsername] = useState('...')
  const [avatarUrl, setAvatarUrl] = useState('/images/profile/avatar1.3.png')
  const [rankSolo, setRankSolo] = useState('bronze')
  const [isOnline, setIsOnline] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [showFriendRequests, setShowFriendRequests] = useState(false)

  const [onlineFriends, setOnlineFriends] = useState<FriendProfile[]>([])
  const [offlineFriends, setOfflineFriends] = useState<FriendProfile[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const uid = session?.user?.id
      if (!uid) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url, is_online, rank_solo')
        .eq('id', uid)
        .single()

      if (profile) {
        setUsername(profile.username || 'Unknown')
        setAvatarUrl(profile.avatar_url || '/images/profile/avatar1.3.png')
        setIsOnline(profile.is_online)
        setRankSolo(profile.rank_solo || 'bronze')
      }

      const friends = await getFriends()
      setOnlineFriends(friends.filter((f) => f.is_online))
      setOfflineFriends(friends.filter((f) => !f.is_online))

      const incoming = await getIncomingRequests()
      setFriendRequests(incoming)
    }

    fetchData()
  }, [])

  const handleAccept = async (id: string) => {
    await acceptFriendRequest(id)
    setFriendRequests((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="h-full w-[320px] bg-gradient-to-b from-surface via-surface/90 to-surface/70 border-l border-muted px-8 py-10 flex flex-col items-center text-lg text-text overflow-y-auto shadow-2xl rounded-tl-3xl rounded-bl-3xl backdrop-blur-lg">

      {/* Profile */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <Link href="/profile/overview" className="hover:scale-105 transition-transform duration-300">
          <div className="relative w-[320px] h-[320px]">
            <Image
              src={`/images/ranks/${rankSolo}.webp`}
              alt="Rank Badge"
              fill
              className="object-contain"
            />
            <div className="absolute inset-[31.5%] rounded-full overflow-hidden bg-black">
              <Image
                src={avatarUrl}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Link>
        <p className="font-bold text-xl tracking-wide">{username}</p>
        <p className={`text-base ${isOnline ? 'text-success' : 'text-muted'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
        <div className="flex gap-5 mt-2">
          <button onClick={() => setShowSettings(true)} className="p-3 rounded-full bg-background/10 hover:bg-background/20 text-muted hover:text-text transition">
            <Cog6ToothIcon className="w-7 h-7" />
          </button>
          <button onClick={() => setShowAddFriend(true)} className="p-3 rounded-full bg-background/10 hover:bg-background/20 text-muted hover:text-text transition">
            <UserPlusIcon className="w-7 h-7" />
          </button>
          <button onClick={() => setShowFriendRequests(true)} className="p-3 rounded-full bg-background/10 hover:bg-background/20 text-muted hover:text-text transition">
            <BellIcon className="w-7 h-7" />
          </button>
        </div>
      </div>

     

      {/* Online Friends */}
      <div className="w-full mb-6">
        <h4 className="text-primary font-semibold mb-3 text-lg">🟢 Online Friends</h4>
        <div className="flex flex-col gap-2">
          {onlineFriends.length === 0 && <p className="text-muted text-base">No one online</p>}
          {onlineFriends.map((f) => (
            <div key={f.id} className="px-4 py-2 rounded-lg bg-background/80 shadow-sm">{f.username}</div>
          ))}
        </div>
      </div>

      {/* Offline Friends */}
      <div className="w-full">
        <h4 className="text-muted font-semibold mb-3 text-lg">⚪ Offline Friends</h4>
        <div className="flex flex-col gap-2 text-muted">
          {offlineFriends.length === 0 && <p className="text-base">No friends offline</p>}
          {offlineFriends.map((f) => (
            <div key={f.id} className="px-4 py-2 rounded-lg bg-background/40">{f.username}</div>
          ))}
        </div>
      </div>

      {/* Modals */}
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

      {showFriendRequests && (
        <FriendRequestsModal onClose={() => setShowFriendRequests(false)} />
      )}
    </div>
  )
}
