import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { streamELI5Content } from '@/lib/claude/generate'

export async function POST(request: NextRequest) {
  try {
    const { topicId, topicName, topicDescription } = await request.json()

    if (!topicId || !topicName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Cache hit — return immediately as JSON
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

    // Cache miss — stream from Claude.
    // Tee the stream: one branch goes to the client, one accumulates for caching.
    const claudeStream = streamELI5Content(topicName, topicDescription)
    const [clientStream, cacheStream] = claudeStream.tee()

    // Consume the cache branch in the background
    ;(async () => {
      const reader = cacheStream.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
      }

      const jsonMatch = accumulated.match(/\{[\s\S]*\}/)
      if (!jsonMatch) return
      try {
        const content = JSON.parse(jsonMatch[0])
        await supabase.from('cards').insert({
          topic_id: topicId,
          title: content.title,
          hook: content.hook,
          explanation: content.explanation,
          key_points: content.keyPoints,
          fun_fact: content.funFact,
          analogy: content.analogy,
        })
      } catch {}
    })().catch(console.error)

    return new Response(clientStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}
