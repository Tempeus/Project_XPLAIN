import { NextResponse } from 'next/server'
import { TOPICS } from '@/lib/topics'

export async function GET() {
  // Deterministic daily topic based on date
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )
  const topic = TOPICS[dayOfYear % TOPICS.length]
  return NextResponse.json(topic)
}
