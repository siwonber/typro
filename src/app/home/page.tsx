'use client'

import TyproLayout from '@/app/typro-layout'
import NewsFeed from '@/app/components/NewsFeed'
import useCreateProfile from '../hooks/useCreateProfile'

export default function HomePage() {
  useCreateProfile()

  return (
    <TyproLayout>
      <div className="flex justify-center w-full">
        <NewsFeed />
      </div>
    </TyproLayout>
  )
}
