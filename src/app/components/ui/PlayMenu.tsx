'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PlayMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="group relative overflow-hidden isolate px-6 py-2 rounded-full text-text font-semibold border-2 border-primary transition duration-300"
      >
        <span className="relative z-10 group-hover:text-black transition-colors">▶ Play</span>
        <span className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out bg-primary z-0 origin-left rounded-full"></span>
      </button>

      {open && (
        <div className="absolute mt-2 bg-surface border border-muted rounded-md shadow-lg z-50 w-40">
          <button
            onClick={() => router.push('/play/ranked')}
            className="block px-4 py-2 hover:bg-primary hover:text-black w-full text-left"
          >
            Ranked
          </button>
          <button
            onClick={() => router.push('/play/normal')}
            className="block px-4 py-2 hover:bg-primary hover:text-black w-full text-left"
          >
            Normal
          </button>
        </div>
      )}
    </div>
  )
}
