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

type SidebarProps = {
  setActive: (val: 'profile' | 'news') => void
}

export default function Sidebar({ setActive }: SidebarProps) {
  const [username, setUsername] = useState('...')
  const [avatarUrl, setAvatarUrl] = useState('/images/profile/avatar1.3.png')
  const [isOnline, setIsOnline] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [showFriendRequests, setShowFriendRequests] = useState(false)

  const [onlineFriends, setOnlineFriends] = useState<string[]>([])
  const [offlineFriends, setOfflineFriends] = useState<string[]>([])
  const [friendRequests, setFriendRequests] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const uid = session?.user?.id
      if (!uid) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url, is_online')
        .eq('id', uid)
        .single()

      if (profile) {
        setUsername(profile.username || 'Unknown')
        setAvatarUrl(profile.avatar_url || '/images/profile/avatar.png')
        setIsOnline(profile.is_online)
      }

      const friends = await getFriends()
      const online = friends.filter((f) => f.profiles?.is_online).map((f) => f.profiles.username)
      const offline = friends.filter((f) => !f.profiles?.is_online).map((f) => f.profiles.username)
      setOnlineFriends(online)
      setOfflineFriends(offline)

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
    <div className="h-full w-[280px] bg-surface border-l border-muted p-6 flex flex-col items-center text-sm text-text overflow-y-auto">
      {/* Profile */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <Link href="/profile/overview" className="hover:opacity-90 group relative">
          <div className={`p-1 rounded-full border-4 ${isOnline ? 'border-yellow-400' : 'border-muted'} transition`}>
            <Image
              src={avatarUrl}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>
        </Link>
        <p className="font-bold text-base">{username}</p>
        <p className={`text-xs ${isOnline ? 'text-success' : 'text-muted'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
        <div className="flex gap-3 mt-2">
          <button onClick={() => setShowSettings(true)} className="p-1 text-muted hover:text-text">
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setShowAddFriend(true)} className="p-1 text-muted hover:text-text">
            <UserPlusIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setShowFriendRequests(true)} className="p-1 text-muted hover:text-text">
            <BellIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Friend Requests Preview */}
      {friendRequests.length > 0 && (
        <div className="w-full bg-background/60 p-3 rounded shadow-inner mb-4">
          <h4 className="text-accent font-semibold mb-2">Friend Requests</h4>
          <div className="flex flex-col gap-2">
            {friendRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-background/80 p-2 rounded">
                <div className="flex items-center gap-2">
                  <Image
                    src={r.profiles.avatar_url || '/images/profile/avatar.png'}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="font-medium">{r.profiles.username}</span>
                </div>
                <button
                  onClick={() => handleAccept(r.id)}
                  className="text-xs bg-primary text-white px-2 py-1 rounded hover:opacity-90"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Online Friends */}
      <div className="w-full mb-4">
        <h4 className="text-primary font-semibold mb-1">Online</h4>
        <div className="flex flex-col gap-1">
          {onlineFriends.length === 0 && <p className="text-muted text-xs">No one online</p>}
          {onlineFriends.map((name) => (
            <div key={name} className="px-3 py-1 rounded bg-background/60">{name}</div>
          ))}
        </div>
      </div>

      {/* Offline Friends */}
      <div className="w-full">
        <h4 className="text-muted font-semibold mb-1">Offline</h4>
        <div className="flex flex-col gap-1 text-muted">
          {offlineFriends.length === 0 && <p className="text-xs">No friends offline</p>}
          {offlineFriends.map((name) => (
            <div key={name} className="px-3 py-1 rounded bg-background/20">{name}</div>
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
