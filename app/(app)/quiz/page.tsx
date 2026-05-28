'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, ChevronRight } from 'lucide-react'
import { TOPICS_BY_CATEGORY } from '@/lib/topics'
import { getCategoryAccentColor, getCategoryLabel, getCategoryEmoji } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface CategoryProgress {
  treasury: number
  risk: number
  accounting: number
}

export default function QuizPage() {
  const [progress, setProgress] = useState<CategoryProgress>({ treasury: 0, risk: 0, accounting: 0 })
  const supabase = createClient()

  useEffect(() => {
    async function loadProgress() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('user_progress')
        .select('topic_id, mastery_score')
        .eq('user_id', user.id)

      if (!data) return

      const cats: CategoryProgress = { treasury: 0, risk: 0, accounting: 0 }
      const counts = { treasury: 0, risk: 0, accounting: 0 }

      for (const row of data) {
        const topicId = row.topic_id as string
        const category = topicId.split('-')[0] as keyof CategoryProgress
        if (category in cats) {
          cats[category] += row.mastery_score
          counts[category]++
        }
      }

      setProgress({
        treasury: counts.treasury ? Math.round(cats.treasury / counts.treasury) : 0,
        risk: counts.risk ? Math.round(cats.risk / counts.risk) : 0,
        accounting: counts.accounting ? Math.round(cats.accounting / counts.accounting) : 0,
      })
    }
    loadProgress()
  }, [supabase])

  const categories = ['treasury', 'risk', 'accounting'] as const

  return (
    <div className="p-4 space-y-5 pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
          Quiz Hub 🧠
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Test your knowledge. Earn XP. Level up.
        </p>
      </motion.div>

      {/* Daily Challenge CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Link href="/daily">
          <div
            className="p-5 rounded-2xl relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #7C3AED20, #8B5CF630, #A78BFA20)', border: '1px solid rgba(139,92,246,0.4)' }}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-20">🏆</div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={16} style={{ color: '#A78BFA' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A78BFA' }}>
                Daily Challenge
              </span>
            </div>
            <p className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Today&apos;s featured topic quiz
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Complete daily quizzes to build your streak 🔥
            </p>
            <div className="flex items-center gap-1 mt-3 text-xs font-bold" style={{ color: '#A78BFA' }}>
              Start now <ChevronRight size={14} />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Category sections */}
      {categories.map((category, ci) => {
        const accentColor = getCategoryAccentColor(category)
        const topics = TOPICS_BY_CATEGORY[category]

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + ci * 0.1 }}
          >
            {/* Category header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getCategoryEmoji(category)}</span>
                <h2 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                  {getCategoryLabel(category)}
                </h2>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full"
                style={{ background: `${accentColor}15`, color: accentColor }}>
                {progress[category]}% mastery
              </span>
            </div>

            {/* Mastery progress bar */}
            <div className="progress-bar mb-3">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress[category]}%` }}
                transition={{ duration: 0.8, delay: 0.3 + ci * 0.1 }}
                style={{ background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})` }}
              />
            </div>

            {/* Topic quiz cards */}
            <div className="space-y-2">
              {topics.map(topic => (
                <Link key={topic.id} href={`/quiz/${topic.id}`}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                  >
                    <span className="text-2xl">{topic.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {topic.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {topic.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-bold" style={{ color: accentColor }}>+60 XP</span>
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
