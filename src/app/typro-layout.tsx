'use client'

import HeaderBar from '@/app/components/HeaderBar'
import Sidebar from '@/app/components/Sidebar'
import { useSession } from '@/lib/auth-helpers-react'
import { useState } from 'react'
import NewsFeed from '@/app/components/NewsFeed'
import Challenges from '@/app/components/Challenges'

type ViewType = 'news' | 'challenges' | 'default'

export default function TyproLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession()
  const [activeView, setActiveView] = useState<ViewType>('default')

  if (loading || typeof window === 'undefined') return null
  if (!session) return null

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Sidebar setActive={() => {}} />
      <div className="flex-1 flex flex-col">
        <HeaderBar setActiveView={setActiveView} />
        <main className="flex-1 overflow-auto">
          {activeView === 'news' && <NewsFeed />}
          {activeView === 'challenges' && <Challenges />}
          {activeView === 'default' && children}
        </main>
      </div>
    </div>
  )
}
