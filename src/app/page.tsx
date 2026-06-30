import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/swipe')
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0A0908',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 360, width: '100%' }}>
        <div style={{ fontSize: 96, lineHeight: 1, marginBottom: 24 }}>🍽️</div>

        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 12,
            letterSpacing: -0.5,
          }}
        >
          Recipe Swipe
        </h1>

        <p
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          Swipe through hundreds of recipes and build your personal meal plan in seconds.
          Swipe right to save, left to skip — it&apos;s that simple.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: '100%',
          }}
        >
          <Link
            href="/auth/login"
            style={{
              display: 'block',
              backgroundColor: '#FF6B2C',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 17,
              padding: '16px 32px',
              borderRadius: 999,
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            style={{
              display: 'block',
              border: '2px solid #FF6B2C',
              color: '#FF6B2C',
              fontWeight: 700,
              fontSize: 17,
              padding: '14px 32px',
              borderRadius: 999,
              textDecoration: 'none',
              textAlign: 'center',
              backgroundColor: 'transparent',
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  )
}
