import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateQuizQuestions } from '@/lib/claude/generate'

export async function POST(request: NextRequest) {
  try {
    const { topicId, topicName, topicDescription, count = 3 } = await request.json()

    if (!topicId || !topicName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check cache
    const { data: cached } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('topic_id', topicId)
      .limit(count)

    if (cached && cached.length >= count) {
      return NextResponse.json(cached.map(q => ({
        id: q.id,
        topicId: q.topic_id,
        question: q.question,
        options: q.options,
        correctIndex: q.correct_index,
        explanation: q.explanation,
      })))
    }

    // Generate new questions
    const questions = await generateQuizQuestions(topicName, topicDescription, count)

    // Cache in DB
    await supabase.from('quiz_questions').insert(
      questions.map(q => ({
        topic_id: topicId,
        question: q.question,
        options: q.options,
        correct_index: q.correctIndex,
        explanation: q.explanation,
      }))
    )

    return NextResponse.json(questions.map(q => ({ ...q, topicId })))
  } catch (error) {
    console.error('Quiz generate error:', error)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
