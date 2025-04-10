'use client'

import HeaderBar from '@/app/components/HeaderBar'
import Sidebar from '@/app/components/Sidebar'
import { useSession } from '@/lib/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TyproLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession()
  const router = useRouter()
  const [activePage, setActivePage] = useState<'news' | 'profile'>('news')

  useEffect(() => {
    if (loading) return
    if (!session) router.push('/')
  }, [session, loading])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Sidebar setActive={setActivePage} />
      <div className="flex-1 flex flex-col">
        <HeaderBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
