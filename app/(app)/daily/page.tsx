'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, BookOpen, ChevronDown, ChevronUp, Lightbulb, Brain } from 'lucide-react'
import { getCategoryAccentColor, getGradientForCategory, getCategoryLabel, getCategoryEmoji } from '@/lib/utils'
import type { Topic, CardContent } from '@/lib/types'

export default function DailyPage() {
  const [topic, setTopic] = useState<Topic | null>(null)
  const [content, setContent] = useState<CardContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [read, setRead] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const topicRes = await fetch('/api/daily')
        const dailyTopic: Topic = await topicRes.json()
        setTopic(dailyTopic)

        const contentRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topicId: dailyTopic.id,
            topicName: dailyTopic.name,
            topicDescription: dailyTopic.description,
          }),
        })
        const contentData = await contentRes.json()
        setContent(contentData)
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="shimmer-card h-48 rounded-2xl" />
        <div className="shimmer-card h-6 rounded-lg w-2/3" />
        <div className="shimmer-card h-4 rounded-lg w-full" />
        <div className="shimmer-card h-4 rounded-lg w-5/6" />
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-5xl mb-4">😕</div>
        <p className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
          Could not load today&apos;s topic
        </p>
      </div>
    )
  }

  const accentColor = getCategoryAccentColor(topic.category)
  const gradient = getGradientForCategory(topic.category)

  return (
    <div className="pb-6">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${gradient} m-4 rounded-2xl p-6 relative overflow-hidden`}
        style={{ border: `1px solid ${accentColor}30`, boxShadow: `0 8px 40px ${accentColor}15` }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${accentColor}, transparent)`, transform: 'translate(20%, -20%)' }} />

        {/* Today's Pick badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40`, color: accentColor }}>
            ⭐ Today&apos;s Pick
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{today}</span>
        </div>

        <div className="flex items-start gap-4">
          <motion.div
            className="text-6xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            {topic.emoji}
          </motion.div>
          <div className="flex-1">
            <span className={`category-badge-${topic.category} px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-2`}>
              {getCategoryEmoji(topic.category)} {getCategoryLabel(topic.category)}
            </span>
            <h1 className="font-display font-bold text-2xl leading-tight" style={{ color: 'var(--text-primary)' }}>
              {topic.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1"><Clock size={12} /> 5 min read</span>
          <span className="flex items-center gap-1"><BookOpen size={12} /> ELI5 Format</span>
          <span className="flex items-center gap-1">✨ +50 XP</span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {content ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {/* Hook */}
            <div className="p-4 rounded-2xl" style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
              <p className="font-display font-bold text-lg italic leading-snug" style={{ color: accentColor }}>
                &ldquo;{content.hook}&rdquo;
              </p>
            </div>

            {/* Explanation */}
            <div className="card-base p-5">
              <h2 className="font-display font-bold text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                The Simple Explanation
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {content.explanation}
              </p>
            </div>

            {/* Key Points */}
            <div className="card-base p-5">
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between"
              >
                <h2 className="font-display font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Key Takeaways
                </h2>
                {expanded ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
              </button>

              {expanded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
                  {content.keyPoints.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ background: `${accentColor}20`, color: accentColor }}>
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{point}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Fun fact */}
            <div className="p-4 rounded-2xl flex gap-3"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Lightbulb size={18} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: '#F59E0B' }}>Did you know?</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{content.funFact}</p>
              </div>
            </div>

            {/* Quiz CTA */}
            {!read ? (
              <motion.div whileTap={{ scale: 0.98 }}>
                <button
                  onClick={() => setRead(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <BookOpen size={16} />
                  Mark as Read — Claim +50 XP
                </button>
              </motion.div>
            ) : (
              <Link href={`/quiz/${topic.id}`}>
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold"
                  style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#A78BFA' }}
                >
                  <Brain size={16} />
                  Test Your Knowledge 🧠
                </motion.button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
            Loading today&apos;s lesson...
          </div>
        )}
      </div>
    </div>
  )
}
