'use client'

import { createContext, useContext, useState } from 'react'

type ViewType = 'news' | 'challenges' | 'default'

interface ViewContextType {
  view: ViewType
  setView: (view: ViewType) => void
}

const ViewContext = createContext<ViewContextType | null>(null)

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ViewType>('default')
  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  )
}

export function useView() {
  const context = useContext(ViewContext)
  if (!context) throw new Error('useView must be used within a ViewProvider')
  return context
}
