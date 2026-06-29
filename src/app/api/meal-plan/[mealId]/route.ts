import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ mealId: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { mealId } = await params

  try {
    await prisma.mealPlanItem.delete({
      where: {
        userId_mealId: {
          userId: session.user.id,
          mealId,
        },
      },
    })

    return NextResponse.json({ message: 'Removed from meal plan' })
  } catch (error) {
    console.error('Error removing from meal plan:', error)
    return NextResponse.json(
      { error: 'Failed to remove from meal plan' },
      { status: 500 }
    )
  }
}