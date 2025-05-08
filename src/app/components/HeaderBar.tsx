'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@lib/supabaseClient'
import PlayMenu from './ui/PlayMenu'
import FancyButton from './ui/FancyButton'

interface HeaderBarProps {
  setActiveView: (view: 'news' | 'challenges' | 'default') => void
}

export default function HeaderBar({ setActiveView }: HeaderBarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <div className="w-full px-10 py-5 bg-surface border-b border-muted text-text flex gap-4 items-center">
      {/* Play-Button mit Dropdown */}
      <PlayMenu />

      <FancyButton onClick={() => setActiveView('challenges')}>
        Challenges
      </FancyButton>

      <FancyButton onClick={() => setActiveView('news')}>
        News
      </FancyButton>

      <FancyButton onClick={handleLogout} className="ml-auto">
        Logout
      </FancyButton>
    </div>
  )
}
