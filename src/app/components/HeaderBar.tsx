'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

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
      <button className="group relative overflow-hidden isolate px-6 py-2 rounded-full text-text font-semibold border-2 border-primary transition duration-300">
        <span className="relative z-10 group-hover:text-black transition-colors">▶ Play</span>
        <span className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out bg-primary z-0 origin-left rounded-full"></span>
      </button>

      <button 
        onClick={() => setActiveView('challenges')}
        className="group relative overflow-hidden isolate px-6 py-2 rounded-full text-text font-semibold border-2 border-primary transition duration-300"
      >
        <span className="relative z-10 group-hover:text-black transition-colors">Challenges</span>
        <span className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out bg-primary z-0 origin-left rounded-full"></span>
      </button>

      <button
        onClick={() => setActiveView('news')}
        className="group relative overflow-hidden isolate px-6 py-2 rounded-full text-text font-semibold border-2 border-primary transition duration-300"
      >
        <span className="relative z-10 group-hover:text-black transition-colors">News</span>
        <span className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out bg-primary z-0 origin-left rounded-full"></span>
      </button>

      <button
        onClick={handleLogout}
        className="ml-auto group relative overflow-hidden isolate px-6 py-2 rounded-full text-text font-semibold border-2 border-primary transition duration-300"
      >
        <span className="relative z-10 group-hover:text-black transition-colors">Logout</span>
        <span className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out bg-primary z-0 origin-left rounded-full"></span>
      </button>
    </div>
  )
}
