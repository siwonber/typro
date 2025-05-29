'use client'
import { supabase } from '@lib/supabaseClient'

export type FriendProfile = {
  id: string
  username: string
  avatar_url?: string
  is_online: boolean
}

export type FriendRequest = {
  id: string
  user_id: string
  friend_id: string
  profiles: {
    username: string
    avatar_url?: string
  }
}

// ✅ Add Friend
export async function addFriend(friendId: string): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const accessToken = session?.access_token
  if (!accessToken) throw new Error('Not authenticated')

  const res = await fetch('/api/friends/add', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ friendId }),
  })

  if (!res.ok) {
    let errorMsg = 'Failed to send request'
    try {
      const data = await res.json()
      errorMsg = data?.error || errorMsg
    } catch {}
    throw new Error(errorMsg)
  }
}

// ✅ Get Incoming Requests
export async function getIncomingRequests(): Promise<FriendRequest[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const accessToken = session?.access_token
  if (!accessToken) throw new Error('Not authenticated')

  const res = await fetch('/api/friends/incoming', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    let errorMsg = 'Failed to load requests'
    try {
      const data = await res.json()
      errorMsg = data?.error || errorMsg
    } catch {}
    throw new Error(errorMsg)
  }

  return res.json()
}

// ✅ Accept Friend Request
export async function acceptFriendRequest(requestId: string): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const accessToken = session?.access_token
  if (!accessToken) throw new Error('Not authenticated')

  const res = await fetch('/api/friends/accept', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requestId }),
  })

  if (!res.ok) {
    let errorMsg = 'Failed to accept request'
    try {
      const data = await res.json()
      errorMsg = data?.error || errorMsg
    } catch {}
    throw new Error(errorMsg)
  }
}

// ✅ Decline Friend Request
export async function declineFriendRequest(requestId: string): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const accessToken = session?.access_token
  if (!accessToken) throw new Error('Not authenticated')

  const res = await fetch('/api/friends/decline', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requestId }),
  })

  if (!res.ok) {
    let errorMsg = 'Failed to decline request'
    try {
      const data = await res.json()
      errorMsg = data?.error || errorMsg
    } catch {}
    throw new Error(errorMsg)
  }
}

// ✅ Get Friends (merged from both directions)
type OutgoingFriendRow = {
  profiles: FriendProfile[] | null
}

type IncomingFriendRow = {
  profiles: FriendProfile[] | null
}

export async function getFriends(): Promise<FriendProfile[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const userId = session?.user?.id
  if (!userId) throw new Error('Not authenticated')

  const { data: outgoingRaw, error: errorOut } = await supabase
    .from('friends')
    .select('friend_id, profiles:friend_id ( id, username, avatar_url, is_online )')
    .eq('user_id', userId)
    .eq('status', 'accepted')

  const { data: incomingRaw, error: errorIn } = await supabase
    .from('friends')
    .select('user_id, profiles:user_id ( id, username, avatar_url, is_online )')
    .eq('friend_id', userId)
    .eq('status', 'accepted')

  if (errorOut || errorIn) throw errorOut || errorIn

  const outgoing = (outgoingRaw as OutgoingFriendRow[]).flatMap((row) =>
    row.profiles && row.profiles.length > 0 ? [row.profiles[0]] : []
  )

  const incoming = (incomingRaw as IncomingFriendRow[]).flatMap((row) =>
    row.profiles && row.profiles.length > 0 ? [row.profiles[0]] : []
  )

  const all = [...outgoing, ...incoming]

  const unique = new Map<string, FriendProfile>()
  for (const f of all) {
    unique.set(f.id, f)
  }

  return Array.from(unique.values())
}
