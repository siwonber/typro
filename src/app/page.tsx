'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '../lib/auth-helpers-react'
import AuthSwitcher from './components/AuthSwitcher'

export default function Page() {
  const router = useRouter()
  const { session, loading } = useSession()  // Statt getSession(), useSession hook verwenden
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!loading && session) {
      router.replace('/home')  // Weiterleitung nach erfolgreichem Login
    } else {
      setChecked(true)  // Wenn nicht eingeloggt, zeige den AuthSwitcher
    }
  }, [loading, session, router])

  if (loading || !checked) return null  // Ladebildschirm oder noch nicht überprüft

  return (
    <main className="flex flex-col items-center justify-center h-screen text-text bg-background">
      <AuthSwitcher />
    </main>
  )
}
