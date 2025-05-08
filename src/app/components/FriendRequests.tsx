'use client'
import { useEffect, useState } from 'react'
import { getIncomingRequests, acceptFriendRequest } from '../hooks/friends'
import Image from 'next/image'

export default function FriendRequests() {
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const data = await getIncomingRequests()
      setRequests(data)
    }
    fetch()
  }, [])

  const handleAccept = async (id: string) => {
    await acceptFriendRequest(id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  if (requests.length === 0) return null

  return (
    <div>
      <h4 className="text-accent font-semibold mb-1">Friend Requests</h4>
      <div className="flex flex-col gap-2">
        {requests.map((r) => (
          <div key={r.id} className="flex items-center justify-between bg-background/40 p-2 rounded">
            <div className="flex items-center gap-2">
              <Image
                src={r.user_profile?.avatar_url || '/images/profile/avatar.png'}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span>{r.user_profile?.username || 'Unknown'}</span>
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
  )
}
