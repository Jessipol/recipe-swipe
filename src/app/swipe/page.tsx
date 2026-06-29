import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { SwipeClient } from './SwipeClient'

export default async function SwipePage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/login')
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-red-950 to-amber-950">
      <NavBar />
      <SwipeClient />
    </div>
  )
}