'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/swipe')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#221C17',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: '14px 16px',
    fontSize: 16,
    color: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo + title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 16 }}>🍽️</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)' }}>
            Sign in to continue swiping
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            backgroundColor: '#18140F',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            padding: '28px 24px',
          }}
        >
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(255,69,58,0.15)',
                  border: '1px solid rgba(255,69,58,0.4)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 16,
                  fontSize: 14,
                  color: '#FF453A',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? 'rgba(255,107,44,0.4)' : '#FF6B2C',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 17,
                padding: '16px',
                borderRadius: 14,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              style={{ color: '#FF6B2C', fontWeight: 600, textDecoration: 'none' }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
