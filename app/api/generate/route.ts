import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateELI5Content } from '@/lib/claude/generate'

export async function POST(request: NextRequest) {
  try {
    const { topicId, topicName, topicDescription } = await request.json()

    if (!topicId || !topicName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check cache first
    const { data: cached } = await supabase
      .from('cards')
      .select('*')
      .eq('topic_id', topicId)
      .single()

    if (cached) {
      return NextResponse.json({
        topicId,
        title: cached.title,
        hook: cached.hook,
        explanation: cached.explanation,
        keyPoints: cached.key_points,
        funFact: cached.fun_fact,
        analogy: cached.analogy,
      })
    }

    // Generate new content
    const content = await generateELI5Content(topicName, topicDescription)
    content.topicId = topicId

    // Cache in DB
    await supabase.from('cards').insert({
      topic_id: topicId,
      title: content.title,
      hook: content.hook,
      explanation: content.explanation,
      key_points: content.keyPoints,
      fun_fact: content.funFact,
      analogy: content.analogy,
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}
