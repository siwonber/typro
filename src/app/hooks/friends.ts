import { supabase } from '@lib/supabaseClient'

// Add a new friend request (user → friend)
export async function addFriend(friendId: string) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user) {
    throw new Error('Not authenticated')
  }

  const userId = session.user.id

  const { error } = await supabase
    .from('friends')
    .insert([{ user_id: userId, friend_id: friendId, status: 'pending' }])

  if (error) throw error
  return true
}

// Get accepted friends (friend_id → profile)
type FriendProfile = {
  username: string
  is_online: boolean
}

type FriendRecord = {
  friend_id: string
  profiles: FriendProfile
}

export async function getFriends(): Promise<FriendRecord[]> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user) throw sessionError
  const userId = session.user.id

  const { data, error } = await supabase
    .from('friends')
    .select(`
      id,
      user_id,
      friend_id,
      profiles:friend_id (
        username,
        is_online
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'accepted')

  if (error) throw error
  return data as unknown as FriendRecord[]
}

// Get incoming friend requests (user_id → profile)
export async function getIncomingRequests() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const userId = session?.user?.id
  if (!userId) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('friends')
    .select(`id, user_id, friend_id, user_profile:profiles!friends_user_id_fkey(username, avatar_url)`)
    .eq('friend_id', userId)
    .eq('status', 'pending')

  if (error) throw error
  return data
}

// Accept a friend request
export async function acceptFriendRequest(friendRequestId: string) {
  const { error: updateError } = await supabase
    .from('friends')
    .update({ status: 'accepted' })
    .eq('id', friendRequestId)

  if (updateError) throw updateError

  const { data, error } = await supabase
    .from('friends')
    .select('user_id, friend_id')
    .eq('id', friendRequestId)
    .single()

  if (error || !data) return

  const { user_id, friend_id } = data

  await supabase.from('friends').insert({
    user_id: friend_id,
    friend_id: user_id,
    status: 'accepted',
  })
}

// Decline
export async function declineFriendRequest(friendRequestId: string) {
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', friendRequestId)

  if (error) throw error
}
