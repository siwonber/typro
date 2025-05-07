'use client'

import TyproLayout from '@/typro-layout'
import NewsFeed from '@/components/NewsFeed'
import { useSession } from '@lib/auth-helpers-react'

export default function HomePage() {
  const { session, loading } = useSession()

  if (loading || !session) return null  
  return (
    <TyproLayout>
      <div className="flex justify-center w-full">
        <NewsFeed />
      </div>
    </TyproLayout>
  )
}
