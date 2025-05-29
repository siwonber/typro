import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  console.log('🔥 [API] Incoming friend requests route hit')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('❌ Auth error or no user:', authError)
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: requests, error: requestError } = await supabase
    .from('friends')
    .select('id, user_id, friend_id')
    .eq('friend_id', user.id)
    .eq('status', 'pending')

  if (requestError) {
    console.error('❌ DB error:', requestError)
    return NextResponse.json({ error: requestError.message }, { status: 500 })
  }

  if (!requests || requests.length === 0) {
    console.log('ℹ️ No friend requests found')
    return NextResponse.json([])
  }

  const senderIds = requests.map((r) => r.user_id)

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', senderIds)

  if (profilesError) {
    console.error('❌ Profile lookup error:', profilesError)
    return NextResponse.json({ error: profilesError.message }, { status: 500 })
  }

  const profileMap = new Map(profiles.map((p) => [p.id, p]))

  const enriched = requests.map((r) => ({
    ...r,
    profiles: profileMap.get(r.user_id) ?? null,
  }))

  console.log('✅ Loaded friend requests:\n', JSON.stringify(enriched, null, 2))

  return NextResponse.json(enriched)
}
