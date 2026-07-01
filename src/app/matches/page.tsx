import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { MatchesClient } from './MatchesClient'

export default async function MatchesPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/login')
  }
  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0A0908' }}>
      <NavBar />
      <MatchesClient />
    </div>
  )
}
