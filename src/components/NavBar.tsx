'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavBar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session) return null

  const tabs = [
    { href: '/swipe', label: 'Discover', icon: '🍽️' },
    { href: '/meal-plan', label: 'My Plan', icon: '📋' },
    { href: '/matches', label: 'Matches', icon: '❤️' },
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(10,9,8,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              gap: 3,
              color: active ? '#FF6B2C' : 'rgba(255,255,255,0.35)',
              textDecoration: 'none',
              minHeight: 56,
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 400, letterSpacing: 0.2 }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
          paddingBottom: 10,
          gap: 3,
          color: 'rgba(255,255,255,0.35)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          minHeight: 56,
        }}
      >
        <span style={{ fontSize: 22 }}>👋</span>
        <span style={{ fontSize: 11, fontWeight: 400, letterSpacing: 0.2 }}>Sign Out</span>
      </button>
    </nav>
  )
}
