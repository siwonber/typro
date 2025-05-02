import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')
  if (!username) return NextResponse.json({ error: 'No username' }, { status: 400 })

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
