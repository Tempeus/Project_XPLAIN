'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getTopicById } from '@/lib/topics'
import { getCategoryAccentColor } from '@/lib/utils'
import QuizCard from '@/components/quiz/QuizCard'

export default function TopicQuizPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params)
  const topic = getTopicById(topicId)

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-5xl mb-4">😕</div>
        <p className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
          Topic not found
        </p>
        <Link href="/quiz" className="text-sm" style={{ color: 'var(--primary-light)' }}>
          ← Back to Quiz Hub
        </Link>
      </div>
    )
  }

  const accentColor = getCategoryAccentColor(topic.category)

  return (
    <div className="p-4 pb-6">
      {/* Back button */}
      <Link href="/quiz" className="inline-flex items-center gap-2 text-sm mb-5 hover:opacity-80 transition-opacity"
        style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={16} />
        Back to Quiz Hub
      </Link>

      {/* Topic header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6 p-4 rounded-2xl"
        style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}25` }}
      >
        <span className="text-4xl">{topic.emoji}</span>
        <div>
          <h1 className="font-display font-bold text-xl leading-tight" style={{ color: 'var(--text-primary)' }}>
            {topic.name}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>3 questions • earn up to 60 XP</p>
        </div>
      </motion.div>

      {/* Quiz */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <QuizCard topic={topic} />
      </motion.div>
    </div>
  )
}
