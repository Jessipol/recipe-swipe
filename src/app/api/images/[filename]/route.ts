import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return new NextResponse('Not found', { status: 404 })
  }

  const filePath = path.join(process.cwd(), 'data', 'images', filename)

  try {
    const buffer = fs.readFileSync(filePath)
    const ext = path.extname(filename).toLowerCase()
    const contentType = MIME[ext] ?? 'application/octet-stream'
    return new NextResponse(buffer, { headers: { 'Content-Type': contentType } })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
