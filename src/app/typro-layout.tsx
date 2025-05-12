'use client'

import HeaderBar from '@/components/HeaderBar'
import Sidebar from '@/components/Sidebar'
import { useSession } from '@lib/auth-helpers-react'
import { useState, useEffect } from 'react'
import NewsFeed from '@/components/NewsFeed'
import Challenges from '@/components/Challenges'
import { usePathname, useRouter } from 'next/navigation'

type ViewType = 'news' | 'challenges' | 'default'

export default function TyproLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession()
  const [activeView, setActiveView] = useState<ViewType>('default')
  const pathname = usePathname()
  const router = useRouter()

  if (loading || typeof window === 'undefined') return null
  if (!session) return null

  const handleSetActiveView = (view: ViewType) => {
    if (pathname !== '/home') {
      router.push('/home')
    }
    setActiveView(view)
  }

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Sidebar setActive={() => {}} />
      <div className="flex-1 flex flex-col">
        <HeaderBar setActiveView={handleSetActiveView} />
        <main className="flex-1 overflow-auto">
          {activeView === 'news' && <NewsFeed />}
          {activeView === 'challenges' && <Challenges />}
          {activeView === 'default' && children}
        </main>
      </div>
    </div>
  )
}
