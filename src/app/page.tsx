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
    <main className="min-h-screen bg-gradient-to-br from-orange-950 via-red-950 to-amber-950 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🍽️</div>
        <h1 className="text-5xl font-bold text-orange-100 mb-4">
          Recipe Swipe
        </h1>
        <p className="text-orange-300 text-lg mb-8">
          Discover delicious recipes with a swipe. Right for your meal plan,
          left to skip.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/login"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-center"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="border-2 border-orange-400 text-orange-300 hover:bg-orange-900 font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-center"
          >
            Create Account
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">👈</div>
            <p className="text-orange-400 text-sm">Swipe left to skip</p>
          </div>
          <div>
            <div className="text-3xl mb-2">❤️</div>
            <p className="text-orange-400 text-sm">Find new favorites</p>
          </div>
          <div>
            <div className="text-3xl mb-2">👉</div>
            <p className="text-orange-400 text-sm">Swipe right to save</p>
          </div>
        </div>
      </div>
    </main>
  )
}