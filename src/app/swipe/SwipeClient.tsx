'use client'

import { useState, useEffect, useRef } from 'react'

interface Dish {
  id: string
  name: string
  imageUrl: string
  category: string
  area: string
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

    setOffset({ x: dir === 'right' ? 800 : -800, y: 0 })
    await new Promise((r) => setTimeout(r, 350))

    const dish = dishesRef.current[indexRef.current]
    if (dish) {
      if (dir === 'right') {
        setSwipeMessage('Added to meal plan! ❤️')
        try {
          await fetch('/api/meal-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mealId: dish.id,
              mealName: dish.name,
              mealThumb: dish.imageUrl,
              category: dish.category,
              area: dish.area,
            }),
          })
        } catch (err) {
          console.error('Error saving to meal plan:', err)
        }
      } else {
        setSwipeMessage('Skipped 👋')
      }
      setTimeout(() => setSwipeMessage(null), 1500)
    }

    const next = indexRef.current + 1
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
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🍳</div>
          <p className="text-orange-300 text-lg">Loading delicious recipes...</p>
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
    <div className="flex flex-col items-center justify-start pt-6 px-4 pb-8 min-h-[calc(100vh-64px)]">
      {swipeMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-orange-900/90 border border-orange-600 text-orange-100 px-6 py-3 rounded-full text-sm font-medium shadow-lg">
          {swipeMessage}
        </div>
      )}

      <div className="relative w-full max-w-sm" style={{ height: '480px' }}>
        {thirdDish && (
          <div
            className="absolute w-full rounded-2xl overflow-hidden shadow-xl pointer-events-none"
            style={{
              height: '480px',
              backgroundImage: `url(${thirdDish.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'scale(0.92) translateY(16px)',
              zIndex: 1,
            }}
          />
        )}

        {nextDish && (
          <div
            className="absolute w-full rounded-2xl overflow-hidden shadow-xl pointer-events-none"
            style={{
              height: '480px',
              backgroundImage: `url(${nextDish.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'scale(0.96) translateY(8px)',
              zIndex: 2,
            }}
          />
        )}

        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="absolute w-full rounded-2xl overflow-hidden shadow-2xl select-none"
          style={{
            height: '480px',
            backgroundImage: `url(${currentDish.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateX(${offset.x}px) translateY(${offset.y * 0.3}px) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.35s ease',
            zIndex: 3,
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
          }}
        >
          {showNope && (
            <div className="absolute top-6 right-6 border-4 border-red-500 text-red-500 font-bold text-2xl px-3 py-1 rounded-lg rotate-12 opacity-90">
              NOPE
            </div>
          )}
          {showLike && (
            <div className="absolute top-6 left-6 border-4 border-green-500 text-green-500 font-bold text-2xl px-3 py-1 rounded-lg -rotate-12 opacity-90">
              LIKE
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-white text-2xl font-bold leading-tight mb-2">
              {currentDish.name}
            </h2>
            <div className="flex gap-2 flex-wrap">
              {currentDish.category && (
                <span className="bg-orange-500/80 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {currentDish.category}
                </span>
              )}
              {currentDish.area && (
                <span className="bg-amber-600/80 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {currentDish.area}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-8 items-center">
        <button
          onClick={() => doSwipe('left')}
          disabled={swipingRef.current}
          className="w-16 h-16 rounded-full bg-orange-950 border-2 border-red-500/60 text-red-400 hover:bg-red-900/30 hover:border-red-400 transition-all duration-200 flex items-center justify-center text-2xl shadow-lg hover:scale-110 active:scale-95 disabled:opacity-50"
          title="Skip"
        >
          ✕
        </button>
        <div className="text-orange-500/40 text-sm font-medium">swipe or tap</div>
        <button
          onClick={() => doSwipe('right')}
          disabled={swipingRef.current}
          className="w-16 h-16 rounded-full bg-orange-950 border-2 border-green-500/60 text-green-400 hover:bg-green-900/30 hover:border-green-400 transition-all duration-200 flex items-center justify-center text-2xl shadow-lg hover:scale-110 active:scale-95 disabled:opacity-50"
          title="Add to meal plan"
        >
          ❤
        </button>
      </div>

      <p className="mt-4 text-orange-500/60 text-xs">
        Swipe right to save to your meal plan
      </p>
    </div>
  )
}
