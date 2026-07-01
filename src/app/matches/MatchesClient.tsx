'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MatchedMeal {
  id: string
  mealId: string
  mealName: string
  mealThumb: string
  category: string | null
  area: string | null
  addedAt: string
}

interface MatchResult {
  friendName: string
  matches: MatchedMeal[]
  myCount: number
  theirCount: number
}

export function MatchesClient() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const findMatches = async () => {
    const trimmed = email.trim()
    if (!trimmed) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch(`/api/matches?email=${encodeURIComponent(trimmed)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setResult(data)
      }
    } catch {
      setError('Could not connect. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        backgroundColor: '#0A0908',
        minHeight: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div style={{ padding: '20px 16px 0' }}>
        {/* Header */}
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Matches</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0, marginTop: 2, marginBottom: 28 }}>
          Find recipes you and a friend both love
        </p>

        {/* Email input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
            Friend&apos;s email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && findMatches()}
            placeholder="friend@example.com"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: '#18140F',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: '14px 16px',
              color: '#FFFFFF',
              fontSize: 16,
              outline: 'none',
            }}
          />
        </div>

        <button
          onClick={findMatches}
          disabled={loading || !email.trim()}
          style={{
            width: '100%',
            backgroundColor: loading || !email.trim() ? 'rgba(255,107,44,0.4)' : '#FF6B2C',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: 16,
            padding: '14px',
            borderRadius: 999,
            border: 'none',
            cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
            marginBottom: 32,
            transition: 'background-color 0.15s',
          }}
        >
          {loading ? 'Searching...' : 'Find Matches'}
        </button>

        {/* Error state */}
        {error && (
          <div
            style={{
              backgroundColor: 'rgba(255,69,58,0.12)',
              border: '1px solid rgba(255,69,58,0.3)',
              borderRadius: 14,
              padding: '16px',
              marginBottom: 24,
            }}
          >
            <p style={{ color: '#FF453A', fontSize: 15, fontWeight: 600, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Summary card */}
            <div
              style={{
                backgroundColor: '#18140F',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20,
                padding: '16px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 40 }}>
                {result.matches.length > 0 ? '🎉' : '😔'}
              </div>
              <div>
                <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 16, margin: 0 }}>
                  {result.matches.length > 0
                    ? `${result.matches.length} recipe${result.matches.length !== 1 ? 's' : ''} in common with ${result.friendName}!`
                    : `No matches with ${result.friendName} yet`}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0, marginTop: 4 }}>
                  You saved {result.myCount} · They saved {result.theirCount}
                </p>
              </div>
            </div>

            {/* Match list */}
            {result.matches.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {result.matches.map((meal) => (
                  <div
                    key={meal.mealId}
                    style={{
                      backgroundColor: '#18140F',
                      border: '1px solid rgba(255,107,44,0.2)',
                      borderRadius: 20,
                      padding: '14px',
                      display: 'flex',
                      gap: 14,
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={meal.mealThumb}
                        alt={meal.mealName}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={meal.mealThumb.startsWith('/api/')}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: 16,
                          lineHeight: 1.3,
                          margin: 0,
                          marginBottom: 6,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {meal.mealName}
                      </h3>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {meal.category && (
                          <span
                            style={{
                              backgroundColor: 'rgba(255,107,44,0.15)',
                              color: '#FF6B2C',
                              fontSize: 11,
                              fontWeight: 600,
                              padding: '3px 10px',
                              borderRadius: 999,
                            }}
                          >
                            {meal.category}
                          </span>
                        )}
                        {meal.area && (
                          <span
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.07)',
                              color: 'rgba(255,255,255,0.55)',
                              fontSize: 11,
                              fontWeight: 600,
                              padding: '3px 10px',
                              borderRadius: 999,
                            }}
                          >
                            {meal.area}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: 20, flexShrink: 0 }}>❤️</div>
                  </div>
                ))}
              </div>
            )}

            {/* No matches nudge */}
            {result.matches.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 16 }}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  Keep swiping! The more you both save, the more likely you&apos;ll find recipes you both love.
                </p>
                <a
                  href="/swipe"
                  style={{
                    display: 'inline-block',
                    marginTop: 16,
                    backgroundColor: '#FF6B2C',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 15,
                    padding: '12px 28px',
                    borderRadius: 999,
                    textDecoration: 'none',
                  }}
                >
                  Discover Recipes
                </a>
              </div>
            )}
          </div>
        )}

        {/* Bottom spacer for nav bar */}
        <div style={{ height: 'calc(56px + env(safe-area-inset-bottom) + 16px)' }} />
      </div>
    </div>
  )
}
