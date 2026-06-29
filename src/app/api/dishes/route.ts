import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'

interface DishRow {
  id: string | number
  name: string
  imageUrl: string
  category: string
  area: string
}

function loadDishes(): DishRow[] {
  const filePath = path.join(process.cwd(), 'data', 'dishes.xlsx')
  const fileBuffer = fs.readFileSync(filePath)
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json<DishRow>(sheet)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function GET() {
  try {
    const dishes = shuffle(loadDishes())
    return NextResponse.json(dishes)
  } catch (error) {
    console.error('Failed to load dishes.xlsx:', error)
    return NextResponse.json({ error: 'Failed to load dishes' }, { status: 500 })
  }
}
