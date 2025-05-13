'use client'

import HeaderBar from '@/components/HeaderBar'
import Sidebar from '@/components/Sidebar'
import { useSession } from '@lib/auth-helpers-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import NewsFeed from '@/components/NewsFeed'
import Challenges from '@/components/Challenges'
import { ViewProvider, useView } from '../lib/ViewContext'

type ViewType = 'news' | 'challenges' | 'default'

export default function TyproLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  if (loading || typeof window === 'undefined') return null
  if (!session) return null

  return (
    <ViewProvider>
      <TyproInnerLayout pathname={pathname} router={router}>
        {children}
      </TyproInnerLayout>
    </ViewProvider>
  )
}

function TyproInnerLayout({
  children,
  pathname,
  router
}: {
  children: React.ReactNode
  pathname: string
  router: any
}) {
  const { view, setView } = useView()

  const handleSetActiveView = (view: ViewType) => {
    if (pathname !== '/home') {
      router.push('/home')
    }
    setView(view)
  }

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Sidebar setActive={() => {}} />
      <div className="flex-1 flex flex-col">
        <HeaderBar setActiveView={handleSetActiveView} />
        <main className="flex-1 overflow-auto">
          {view === 'news' && <NewsFeed />}
          {view === 'challenges' && <Challenges />}
          {view === 'default' && children}
        </main>
      </div>
    </div>
  )
}
