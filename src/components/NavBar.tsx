'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavBar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session) return null

  return (
    <nav className="bg-orange-950/80 backdrop-blur border-b border-orange-800/40 sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-xl">🍽️</span>
          <span className="text-orange-100 font-bold text-lg">RecipeSwipe</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/swipe"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/swipe'
                ? 'bg-orange-500 text-white'
                : 'text-orange-300 hover:text-orange-100 hover:bg-orange-900/50'
            }`}
          >
            Swipe
          </Link>
          <Link
            href="/meal-plan"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/meal-plan'
                ? 'bg-orange-500 text-white'
                : 'text-orange-300 hover:text-orange-100 hover:bg-orange-900/50'
            }`}
          >
            Meal Plan
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-orange-400 hover:text-orange-200 text-sm px-2 py-1.5 rounded-lg hover:bg-orange-900/50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}