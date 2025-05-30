'use client'
import { useEffect, useState } from 'react'
import {
  getIncomingRequests,
  acceptFriendRequest,
  declineFriendRequest,
} from '../hooks/friends'
import Image from 'next/image'
import type { FriendRequest } from '../hooks/friends'
import { Check, X } from 'lucide-react'

export default function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getIncomingRequests()
        // console.log('FRIEND REQUESTS RAW:', data)
        setRequests(data)
      } catch (err) {
        // console.error('Error fetching friend requests:', err)
      }
    }
    fetch()
  }, [])

  const handleAccept = async (id: string) => {
    await acceptFriendRequest(id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  const handleDecline = async (id: string) => {
    await declineFriendRequest(id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  if (requests.length === 0)
    return <p className="text-muted text-sm">No requests found</p>

  return (
    <div>
      <h4 className="text-accent font-semibold mb-1">Friend Requests</h4>
      <div className="flex flex-col gap-2">
        {requests.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between bg-background/40 p-2 rounded"
          >
            <div className="flex items-center gap-2">
              <Image
                src={r.profiles?.avatar_url || '/images/profile/avatar.png'}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span>{r.profiles?.username || 'Unknown'}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(r.id)}
                className="p-1 rounded bg-green-600 text-white hover:opacity-90"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDecline(r.id)}
                className="p-1 rounded bg-red-600 text-white hover:opacity-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
