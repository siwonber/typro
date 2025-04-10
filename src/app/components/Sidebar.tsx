'use client'
import Link from 'next/link'
import Image from 'next/image'

type SidebarProps = {
  setActive: (val: 'profile' | 'news') => void
}

export default function Sidebar({ setActive }: SidebarProps) {
  const online = ['NΔRĐ LOKASON', 'showdown', 'TomTom246']
  const offline = ['4D World', 'SiriusBlack', 'AdrianneAvenicci']

  return (
    <div className="h-full w-[280px] bg-surface border-l border-muted p-6 flex flex-col gap-6 text-sm text-text">
        {/* Profil */}
        <Link
        href="/profile/overview"
        className="flex items-center gap-4 cursor-pointer hover:opacity-90"
      >
        <Image
          src="/images/profile/avatar.png"
          alt="Profil"
          width={64}
          height={64}
          className="rounded-full border-2 border-primary object-cover"
        />
        <div>
          <p className="font-bold text-base">SOM3THING</p>
          <p className="text-success text-xs">Online</p>
        </div>
      </Link>

      {/* Online Friends */}
      <div>
        <h4 className="text-primary font-semibold mb-1">Online</h4>
        <div className="flex flex-col gap-1">
          {online.map((name) => (
            <div key={name} className="px-3 py-1 rounded bg-background/60">
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Offline Friends */}
      <div>
        <h4 className="text-muted font-semibold mb-1">Offline</h4>
        <div className="flex flex-col gap-1 text-muted">
          {offline.map((name) => (
            <div key={name} className="px-3 py-1 rounded bg-background/20">
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
