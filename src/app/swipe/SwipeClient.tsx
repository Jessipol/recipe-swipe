'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import TinderCard from 'react-tinder-card'

interface Meal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string
  strArea: string
}

async function fetchRandomMeal(): Promise<Meal | null> {
  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const data = await res.json()
    return data.meals?.[0] || null
  } catch {
    return null
  }
}

async function fetchBatchMeals(count: number): Promise<Meal[]> {
  const promises = Array.from({ length: count }, () => fetchRandomMeal())
  const results = await Promise.all(promises)
  return results.filter((m): m is Meal => m !== null)
}

export function SwipeClient() {
  const [cards, setCards] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [swipeMessage, setSwipeMessage] = useState<string | null>(null)
  const currentIndexRef = useRef(-1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childRefs = useRef<Map<string, any>>(new Map())

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const meals = await fetchBatchMeals(10)
      setCards(meals)
      currentIndexRef.current = meals.length - 1
      setLoading(false)
    }
    init()
  }, [])

  const swiped = useCallback(
    async (direction: string, meal: Meal, index: number) => {
      currentIndexRef.current = index - 1

      if (direction === 'right') {
        setSwipeMessage('Added to meal plan! ❤️')
        try {
          await fetch('/api/meal-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mealId: meal.idMeal,
              mealName: meal.strMeal,
              mealThumb: meal.strMealThumb,
              category: meal.strCategory,
              area: meal.strArea,
            }),
          })
        } catch (err) {
          console.error('Error saving to meal plan:', err)
        }
      } else {
        setSwipeMessage('Skipped 👋')
      }

      setTimeout(() => setSwipeMessage(null), 1500)

      if (index - 1 < 3) {
        const newMeals = await fetchBatchMeals(5)
        setCards((prev) => {
          const updated = [...newMeals, ...prev]
          currentIndexRef.current = currentIndexRef.current + newMeals.length
          return updated
        })
      }
    },
    []
  )

  const swipe = async (dir: 'left' | 'right') => {
    const idx = currentIndexRef.current
    if (idx < 0 || idx >= cards.length) return
    const currentMeal = cards[idx]
    const ref = childRefs.current.get(currentMeal.idMeal)
    if (ref) {
      await ref.swipe(dir)
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

  return (
    <div className="flex flex-col items-center justify-start pt-6 px-4 pb-8 min-h-[calc(100vh-64px)]">
      {swipeMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-orange-900/90 border border-orange-600 text-orange-100 px-6 py-3 rounded-full text-sm font-medium shadow-lg">
          {swipeMessage}
        </div>
      )}

      <div className="relative w-full max-w-sm" style={{ height: '480px' }}>
        {cards.map((meal, index) => (
          <TinderCard
            key={meal.idMeal}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={(ref: any) => {
              if (ref) childRefs.current.set(meal.idMeal, ref)
            }}
            onSwipe={(dir) => swiped(dir, meal, index)}
            preventSwipe={['up', 'down']}
            className="absolute w-full"
          >
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none"
              style={{
                height: '480px',
                backgroundImage: `url(${meal.strMealThumb})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="text-white text-2xl font-bold leading-tight mb-2">
                  {meal.strMeal}
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {meal.strCategory && (
                    <span className="bg-orange-500/80 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {meal.strCategory}
                    </span>
                  )}
                  {meal.strArea && (
                    <span className="bg-amber-600/80 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {meal.strArea}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>

      <div className="flex gap-6 mt-8 items-center">
        <button
          onClick={() => swipe('left')}
          className="w-16 h-16 rounded-full bg-orange-950 border-2 border-red-500/60 text-red-400 hover:bg-red-900/30 hover:border-red-400 transition-all duration-200 flex items-center justify-center text-2xl shadow-lg hover:scale-110 active:scale-95"
          title="Skip"
        >
          ✕
        </button>
        <div className="text-orange-500/40 text-sm font-medium">swipe or tap</div>
        <button
          onClick={() => swipe('right')}
          className="w-16 h-16 rounded-full bg-orange-950 border-2 border-green-500/60 text-green-400 hover:bg-green-900/30 hover:border-green-400 transition-all duration-200 flex items-center justify-center text-2xl shadow-lg hover:scale-110 active:scale-95"
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