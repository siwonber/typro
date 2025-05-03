import { supabase } from '@/lib/supabaseClient'

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

  if (error) {
    throw error
  }

  return true
}



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

export async function getIncomingRequests() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id
  if (!userId) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('friends')
    .select(`id, user_id, profiles:user_id(username, avatar_url)`)
    .eq('friend_id', userId)
    .eq('status', 'pending')

  if (error) throw error
  return data
}


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
