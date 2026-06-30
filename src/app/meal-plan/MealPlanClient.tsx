'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface MealPlanItem {
  id: string
  mealId: string
  mealName: string
  mealThumb: string
  category: string | null
  area: string | null
  addedAt: string
}

export function MealPlanClient() {
  const [meals, setMeals] = useState<MealPlanItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetting, setResetting] = useState(false)

  const STORAGE_KEY = 'recipe-swipe-meal-plan'

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      setMeals(data)
    } catch {
      setMeals([])
    }
    setLoading(false)
  }, [])

  const removeFromMealPlan = (mealId: string) => {
    setRemoving(mealId)
    const updated = meals.filter((m) => m.mealId !== mealId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setMeals(updated)
    setRemoving(null)
  }

  const resetMealPlan = () => {
    setResetting(true)
    localStorage.removeItem(STORAGE_KEY)
    setMeals([])
    setResetting(false)
    setConfirmReset(false)
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          backgroundColor: '#0A0908',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17 }}>Loading your meal plan...</p>
        </div>
      </div>
    )
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
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 24,
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>My Plan</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0, marginTop: 2 }}>
              {meals.length} recipe{meals.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {meals.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              {confirmReset ? (
                <>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Clear all?</span>
                  <button
                    onClick={resetMealPlan}
                    disabled={resetting}
                    style={{
                      backgroundColor: 'rgba(255,69,58,0.15)',
                      border: '1px solid #FF453A',
                      color: '#FF453A',
                      fontSize: 13,
                      fontWeight: 600,
                      padding: '6px 14px',
                      borderRadius: 999,
                      cursor: resetting ? 'not-allowed' : 'pointer',
                      opacity: resetting ? 0.5 : 1,
                    }}
                  >
                    {resetting ? '...' : 'Yes'}
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: 13,
                      fontWeight: 600,
                      padding: '6px 14px',
                      borderRadius: 999,
                      cursor: 'pointer',
                    }}
                  >
                    No
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmReset(true)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,69,58,0.5)',
                    color: '#FF453A',
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: 999,
                    cursor: 'pointer',
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty state */}
        {meals.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              paddingTop: 80,
              paddingBottom: 40,
            }}
          >
            <div style={{ fontSize: 72, marginBottom: 16 }}>🍽️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
              No recipes saved yet
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>
              Start swiping to add recipes to your meal plan!
            </p>
            <a
              href="/swipe"
              style={{
                display: 'inline-block',
                backgroundColor: '#FF6B2C',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 16,
                padding: '14px 32px',
                borderRadius: 999,
                textDecoration: 'none',
              }}
            >
              Start Swiping
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {meals.map((meal) => (
              <div
                key={meal.id}
                style={{
                  backgroundColor: '#18140F',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 20,
                  padding: '14px',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                }}
              >
                {/* Thumbnail */}
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

                {/* Content */}
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
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
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
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
                    Added {new Date(meal.addedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Delete button — 44×44 tap target */}
                <button
                  onClick={() => removeFromMealPlan(meal.mealId)}
                  disabled={removing === meal.mealId}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#FF453A',
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: removing === meal.mealId ? 'not-allowed' : 'pointer',
                    opacity: removing === meal.mealId ? 0.4 : 1,
                    flexShrink: 0,
                  }}
                  title="Remove from meal plan"
                >
                  {removing === meal.mealId ? '…' : '✕'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom spacer for nav bar */}
        <div style={{ height: 'calc(56px + env(safe-area-inset-bottom) + 16px)' }} />
      </div>
    </div>
  )
}
