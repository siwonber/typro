'use client'

import Image from 'next/image'

const stats = [
  {
    label: 'SOLO/DUO',
    value: 'Platin I',
    icon: '/images/ranks/platin.webp',
  },
  {
    label: 'STREAK',
    value: '5',
    icon: null,
  },
  {
    label: 'STYLE',
    value: 'Aggressive',
    icon: null,
  },
  {
    label: 'TROPHÄE',
    value: '—',
    icon: null,
  },
  {
    label: 'BANNER',
    value: 'Beta',
    icon: null,
  },
]

export default function Stats() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map(({ label, value, icon }) => (
        <div
          key={label}
          className="bg-[var(--color-surface)] bg-opacity-10 border border-[var(--color-muted)] rounded-xl p-4 flex flex-col items-center text-center"
        >
          {icon ? (
            <Image src={icon} alt={label} width={48} height={48} className="mb-2" />
          ) : (
            <div className="text-3xl mb-2">🎮</div>
          )}
          <p className="text-xs text-[var(--color-muted)]">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      ))}
    </section>
  )
}
