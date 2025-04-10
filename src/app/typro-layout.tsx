'use client'

import HeaderBar from '@/app/components/HeaderBar'
import Sidebar from '@/app/components/Sidebar'
import { useSession } from '@/lib/auth-helpers-react'

export default function TyproLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession()

  if (loading || typeof window === 'undefined') return null
  if (!session) return null

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Sidebar setActive={() => {}} />
      <div className="flex-1 flex flex-col">
        <HeaderBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
