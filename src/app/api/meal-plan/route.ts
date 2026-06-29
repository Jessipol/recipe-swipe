import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const mealPlan = await prisma.mealPlanItem.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: 'desc' },
  })

  return NextResponse.json(mealPlan)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { mealId, mealName, mealThumb, category, area } = await req.json()

    const item = await prisma.mealPlanItem.upsert({
      where: {
        userId_mealId: {
          userId: session.user.id,
          mealId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        mealId,
        mealName,
        mealThumb,
        category,
        area,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error adding to meal plan:', error)
    return NextResponse.json(
      { error: 'Failed to add to meal plan' },
      { status: 500 }
    )
  }
}