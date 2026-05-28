import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const XP_MAP = {
  read: 10,
  quiz_correct: 20,
  quiz_wrong: 5,
  daily: 50,
} as const

const MASTERY_DELTA = {
  read: 5,
  quiz_correct: 15,
  quiz_wrong: -5,
  daily: 20,
} as const

export async function POST(request: NextRequest) {
  try {
    const { topicId, action } = await request.json() as {
      topicId: string
      action: keyof typeof XP_MAP
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const xpGain = XP_MAP[action] ?? 0
    const masteryDelta = MASTERY_DELTA[action] ?? 0
    const today = new Date().toISOString().split('T')[0]

    // Update or create user_progress
    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .single()

    if (existing) {
      await supabase.from('user_progress').update({
        mastery_score: Math.max(0, Math.min(100, (existing.mastery_score ?? 0) + masteryDelta)),
        cards_read: action === 'read' ? (existing.cards_read ?? 0) + 1 : existing.cards_read,
        quizzes_taken: action.startsWith('quiz') ? (existing.quizzes_taken ?? 0) + 1 : existing.quizzes_taken,
        correct_answers: action === 'quiz_correct' ? (existing.correct_answers ?? 0) + 1 : existing.correct_answers,
        last_activity: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('user_progress').insert({
        user_id: user.id,
        topic_id: topicId,
        mastery_score: Math.max(0, masteryDelta),
        cards_read: action === 'read' ? 1 : 0,
        quizzes_taken: action.startsWith('quiz') ? 1 : 0,
        correct_answers: action === 'quiz_correct' ? 1 : 0,
      })
    }

    // Update streak + XP
    const { data: streak } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (streak) {
      const lastDate = streak.last_activity_date
      const isNewDay = lastDate !== today
      const isYesterday = lastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const newStreak = isNewDay ? (isYesterday ? (streak.current_streak ?? 0) + 1 : 1) : (streak.current_streak ?? 0)

      await supabase.from('user_streaks').update({
        xp: (streak.xp ?? 0) + xpGain,
        current_streak: newStreak,
        longest_streak: Math.max(streak.longest_streak ?? 0, newStreak),
        last_activity_date: today,
      }).eq('user_id', user.id)
    } else {
      await supabase.from('user_streaks').insert({
        user_id: user.id,
        xp: xpGain,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
      })
    }

    return NextResponse.json({ xpGained: xpGain })
  } catch (error) {
    console.error('Progress error:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
