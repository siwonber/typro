'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function ProfileHeader() {
  const pathname = usePathname()

  const navLinks = [
    { label: 'Overview', href: '/profile/overview' },
    { label: 'Challenges', href: '/profile/challenges' },
    { label: 'Stats', href: '/profile/stats' },
  ]

  return (
    <nav className="w-full bg-surface border-b border-muted px-10 py-3">
      <ul className="flex justify-center gap-10">
        {navLinks.map(({ label, href }) => {
          const isActive = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-semibold transition-colors tracking-wide ${
                  isActive ? 'text-primary' : 'text-muted hover:text-primary'
                }`}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
