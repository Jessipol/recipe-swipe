import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = req.nextUrl.searchParams.get('email')?.trim()
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  if (email.toLowerCase() === session.user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'Cannot match with yourself' }, { status: 400 })
  }

  const otherUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true },
  })

  if (!otherUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const [myPlan, theirPlan] = await Promise.all([
    prisma.mealPlanItem.findMany({ where: { userId: session.user.id } }),
    prisma.mealPlanItem.findMany({ where: { userId: otherUser.id } }),
  ])

  const theirMealIds = new Set(theirPlan.map((m) => m.mealId))
  const matches = myPlan.filter((m) => theirMealIds.has(m.mealId))

  return NextResponse.json({
    friendName: otherUser.name || otherUser.email,
    matches,
    myCount: myPlan.length,
    theirCount: theirPlan.length,
  })
}
