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
