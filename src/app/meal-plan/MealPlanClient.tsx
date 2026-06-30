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

  const fetchMealPlan = async () => {
    try {
      const res = await fetch('/api/meal-plan')
      if (res.ok) {
        const data = await res.json()
        setMeals(data)
      }
    } catch (err) {
      console.error('Error fetching meal plan:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMealPlan()
  }, [])

  const removeFromMealPlan = async (mealId: string) => {
    setRemoving(mealId)
    try {
      const res = await fetch(`/api/meal-plan/${mealId}`, { method: 'DELETE' })
      if (res.ok) {
        setMeals((prev) => prev.filter((m) => m.mealId !== mealId))
      }
    } catch (err) {
      console.error('Error removing from meal plan:', err)
    } finally {
      setRemoving(null)
    }
  }

  const resetMealPlan = async () => {
    setResetting(true)
    try {
      await fetch('/api/meal-plan', { method: 'DELETE' })
      setMeals([])
    } catch (err) {
      console.error('Error resetting meal plan:', err)
    } finally {
      setResetting(false)
      setConfirmReset(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">📋</div>
          <p className="text-orange-300 text-lg">Loading your meal plan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-orange-100">Your Meal Plan</h1>
          <p className="text-orange-400 mt-1">
            {meals.length} recipe{meals.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        {meals.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            {confirmReset ? (
              <>
                <span className="text-orange-300 text-sm">Clear all?</span>
                <button
                  onClick={resetMealPlan}
                  disabled={resetting}
                  className="bg-red-700 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {resetting ? '...' : 'Yes'}
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="bg-orange-900 hover:bg-orange-800 text-orange-200 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  No
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="bg-orange-900/60 hover:bg-red-900/40 border border-orange-700/40 hover:border-red-600/60 text-orange-400 hover:text-red-400 text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-7xl mb-4">🍽️</div>
          <h2 className="text-xl font-semibold text-orange-200 mb-2">No recipes saved yet</h2>
          <p className="text-orange-400">Start swiping to add recipes to your meal plan!</p>
          <a href="/swipe" className="inline-block mt-6 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200">
            Start Swiping
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {meals.map((meal) => (
            <div key={meal.id} className="bg-orange-950/60 border border-orange-800/40 rounded-xl overflow-hidden flex gap-4 p-4 hover:border-orange-700/60 transition-colors">
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <Image src={meal.mealThumb} alt={meal.mealName} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-orange-100 font-semibold text-lg leading-tight truncate">{meal.mealName}</h3>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {meal.category && <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-0.5 rounded-full">{meal.category}</span>}
                  {meal.area && <span className="bg-amber-600/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">{meal.area}</span>}
                </div>
                <p className="text-orange-600 text-xs mt-2">Added {new Date(meal.addedAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => removeFromMealPlan(meal.mealId)} disabled={removing === meal.mealId} className="flex-shrink-0 text-red-400 hover:text-red-300 hover:bg-red-900/30 w-9 h-9 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50" title="Remove from meal plan">
                {removing === meal.mealId ? '...' : 'x'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}