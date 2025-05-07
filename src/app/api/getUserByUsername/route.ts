import { supabase } from '@lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', username)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ id: data.id })
}
