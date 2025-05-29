// src/app/api/friends/add/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(req: NextRequest) {
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
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { friendId } = await req.json()

  if (user.id === friendId) {
    return NextResponse.json({ error: 'You cannot add yourself' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('friends')
    .select('id')
    .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},user_id.eq.${user.id})`)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Already friends or pending' }, { status: 400 })
  }

  const { error: insertError } = await supabase.from('friends').insert({
    user_id: user.id,
    friend_id: friendId,
    status: 'pending',
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
