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

function buildImageMap(): Map<string, string> {
  const map = new Map<string, string>()
  const dir = path.join(process.cwd(), 'data', 'images')
  try {
    for (const file of fs.readdirSync(dir)) {
      const sep = file.indexOf('_')
      if (sep > 0) map.set(file.slice(0, sep), file)
    }
  } catch {
    // directory absent or unreadable — no local images
  }
  return map
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
    const imageMap = buildImageMap()
    const dishes = loadDishes().map((d) => {
      const id = String(d.id)
      const localFile = imageMap.get(id)
      return {
        ...d,
        id,
        imageUrl: localFile ? `/api/images/${localFile}` : d.imageUrl,
      }
    })
    return NextResponse.json(shuffle(dishes))
  } catch (error) {
    console.error('Failed to load dishes.xlsx:', error)
    return NextResponse.json({ error: 'Failed to load dishes' }, { status: 500 })
  }
}
