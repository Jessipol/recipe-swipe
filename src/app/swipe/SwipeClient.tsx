'use client'

import { useState, useEffect, useRef } from 'react'

interface Dish {
  id: string
  name: string
  imageUrl: string
  category: string
  area: string
}

interface StoredMeal {
  id: string
  mealId: string
  mealName: string
  mealThumb: string
  category: string
  area: string
  addedAt: string
}

async function fetchDishes(): Promise<Dish[]> {
  try {
    const res = await fetch('/api/dishes')
    const data = await res.json()
    return Array.isArray(data) ? data.map((d) => ({ ...d, id: String(d.id) })) : []
  } catch {
    return []
  }
}

const SWIPE_THRESHOLD = 80

export function SwipeClient() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [swipeMessage, setSwipeMessage] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const dishesRef = useRef<Dish[]>([])
  const indexRef = useRef(0)
  const startPosRef = useRef({ x: 0, y: 0 })
  const swipingRef = useRef(false)
  const draggingRef = useRef(false)

  useEffect(() => { dishesRef.current = dishes }, [dishes])
  useEffect(() => { indexRef.current = index }, [index])

  useEffect(() => {
    fetchDishes().then((data) => {
      setDishes(data)
      setLoading(false)
    })
  }, [])

  async function doSwipe(dir: 'left' | 'right') {
    if (swipingRef.current) return
    swipingRef.current = true
    draggingRef.current = false
    setIsDragging(false)

    // Capture dish and index before any async wait
    const dish = dishesRef.current[indexRef.current]
    const capturedIndex = indexRef.current

    setOffset({ x: dir === 'right' ? 800 : -800, y: 0 })
    await new Promise((r) => setTimeout(r, 350))

    if (dish) {
      if (dir === 'right') {
        try {
          const key = 'recipe-swipe-meal-plan'
          const existing = JSON.parse(localStorage.getItem(key) || '[]') as StoredMeal[]
          if (!existing.find((m) => m.mealId === dish.id)) {
            existing.unshift({
              id: `${dish.id}-${Date.now()}`,
              mealId: dish.id,
              mealName: dish.name,
              mealThumb: dish.imageUrl,
              category: dish.category,
              area: dish.area,
              addedAt: new Date().toISOString(),
            })
            localStorage.setItem(key, JSON.stringify(existing))
          }
          setSwipeMessage('Added to meal plan! ❤️')
        } catch {
          setSwipeMessage('Could not save, try again ⚠️')
        }
      } else {
        setSwipeMessage('Skipped 👋')
      }
      setTimeout(() => setSwipeMessage(null), 2000)
    }

    const next = capturedIndex + 1
    if (next >= dishesRef.current.length) {
      const newDishes = await fetchDishes()
      dishesRef.current = newDishes
      setDishes(newDishes)
      indexRef.current = 0
      setIndex(0)
    } else {
      indexRef.current = next
      setIndex(next)
    }

    setOffset({ x: 0, y: 0 })
    swipingRef.current = false
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (swipingRef.current) return
    e.currentTarget.setPointerCapture(e.pointerId)
    startPosRef.current = { x: e.clientX, y: e.clientY }
    draggingRef.current = true
    setIsDragging(true)
    setOffset({ x: 0, y: 0 })
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || swipingRef.current) return
    setOffset({
      x: e.clientX - startPosRef.current.x,
      y: e.clientY - startPosRef.current.y,
    })
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || swipingRef.current) return
    draggingRef.current = false
    setIsDragging(false)
    const dx = e.clientX - startPosRef.current.x
    if (dx > SWIPE_THRESHOLD) {
      doSwipe('right')
    } else if (dx < -SWIPE_THRESHOLD) {
      doSwipe('left')
    } else {
      setOffset({ x: 0, y: 0 })
    }
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
          <div style={{ fontSize: 64, marginBottom: 16 }}>🍳</div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17 }}>Loading delicious recipes...</p>
        </div>
      </div>
    )
  }

  const currentDish = dishes[index]
  const nextDish = dishes[index + 1]
  const thirdDish = dishes[index + 2]

  if (!currentDish) return null

  const rotation = offset.x * 0.08
  const showNope = !isDragging ? false : offset.x < -30
  const showLike = !isDragging ? false : offset.x > 30

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        backgroundColor: '#0A0908',
        overscrollBehavior: 'none',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {swipeMessage && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            backgroundColor: 'rgba(34,28,23,0.95)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {swipeMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '16px 20px 8px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Discover</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0, marginTop: 2 }}>
          Swipe right to save, left to skip
        </p>
      </div>

      {/* Card stack — flex-1 */}
      <div style={{ flex: 1, position: 'relative', padding: '8px 16px' }}>
        {thirdDish && (
          <div
            key={thirdDish.id}
            style={{
              position: 'absolute',
              inset: '8px 16px',
              borderRadius: 28,
              overflow: 'hidden',
              backgroundImage: `url(${thirdDish.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'scale(0.94) translateY(12px)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        )}

        {nextDish && (
          <div
            key={nextDish.id}
            style={{
              position: 'absolute',
              inset: '8px 16px',
              borderRadius: 28,
              overflow: 'hidden',
              backgroundImage: `url(${nextDish.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'scale(0.97) translateY(6px)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        )}

        <div
          key={currentDish.id}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            position: 'absolute',
            inset: '8px 16px',
            borderRadius: 28,
            overflow: 'hidden',
            backgroundImage: `url(${currentDish.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateX(${offset.x}px) translateY(${offset.y * 0.3}px) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.35s ease',
            zIndex: 3,
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            userSelect: 'none',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}
        >
          {/* NOPE indicator */}
          {showNope && (
            <div
              style={{
                position: 'absolute',
                top: 24,
                right: 20,
                border: '4px solid #FF453A',
                color: '#FF453A',
                fontWeight: 900,
                fontSize: 28,
                padding: '4px 12px',
                borderRadius: 10,
                transform: 'rotate(12deg)',
                opacity: 0.95,
                letterSpacing: 2,
              }}
            >
              NOPE
            </div>
          )}
          {/* LIKE indicator */}
          {showLike && (
            <div
              style={{
                position: 'absolute',
                top: 24,
                left: 20,
                border: '4px solid #30D158',
                color: '#30D158',
                fontWeight: 900,
                fontSize: 28,
                padding: '4px 12px',
                borderRadius: 10,
                transform: 'rotate(-12deg)',
                opacity: 0.95,
                letterSpacing: 2,
              }}
            >
              LIKE
            </div>
          )}

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)',
            }}
          />

          {/* Dish info */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 24px' }}>
            <h2 style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: 0, marginBottom: 10 }}>
              {currentDish.name}
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {currentDish.category && (
                <span
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: 999,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {currentDish.category}
                </span>
              )}
              {currentDish.area && (
                <span
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: 999,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {currentDish.area}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          paddingTop: 16,
          paddingBottom: 16,
        }}
      >
        <button
          onClick={() => doSwipe('left')}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '2px solid #FF453A',
            backgroundColor: 'transparent',
            color: '#FF453A',
            fontSize: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title="Skip"
        >
          ✕
        </button>
        <button
          onClick={() => doSwipe('right')}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#FF6B2C',
            color: '#FFFFFF',
            fontSize: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 4px 20px rgba(255,107,44,0.4)',
          }}
          title="Add to meal plan"
        >
          ♥
        </button>
      </div>

      {/* Spacer matching bottom tab bar height */}
      <div style={{ height: 'calc(56px + env(safe-area-inset-bottom))' }} />
    </div>
  )
}
