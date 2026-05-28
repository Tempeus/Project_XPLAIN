'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Brain, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Lightbulb, Circle } from 'lucide-react'
import { cn, getGradientForCategory, getCategoryAccentColor, getCategoryLabel, getCategoryEmoji } from '@/lib/utils'
import type { Topic, CardContent } from '@/lib/types'
import QuizCard from '@/components/quiz/QuizCard'

interface TopicCardProps {
  topic: Topic
  index: number
}

interface XPFloat {
  id: number
  amount: number
}

export default function TopicCard({ topic, index }: TopicCardProps) {
  const [content, setContent] = useState<CardContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [read, setRead] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [xpFloats, setXpFloats] = useState<XPFloat[]>([])
  const hasLoaded = useRef(false)

  async function loadContent() {
    if (hasLoaded.current || loading) return
    hasLoaded.current = true
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic.id,
          topicName: topic.name,
          topicDescription: topic.description,
        }),
      })
      const data = await res.json()
      setContent(data)
    } catch {
      hasLoaded.current = false
    } finally {
      setLoading(false)
    }
  }

  function floatXP(amount: number) {
    const id = Date.now()
    setXpFloats(prev => [...prev, { id, amount }])
    setTimeout(() => setXpFloats(prev => prev.filter(x => x.id !== id)), 1500)
  }

  async function handleRead() {
    if (read) return
    setRead(true)
    floatXP(10)
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: topic.id, action: 'read' }),
      })
    } catch {}
  }

  async function handleSave() {
    setSaved(!saved)
    try {
      await fetch('/api/bookmarks', {
        method: saved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: topic.id }),
      })
    } catch {}
  }

  const accentColor = getCategoryAccentColor(topic.category)
  const gradient = getGradientForCategory(topic.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      className="relative mx-4 my-3 rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${accentColor}25`,
        boxShadow: `0 4px 40px ${accentColor}10`,
      }}
      viewport={{ once: true }}
      onViewportEnter={loadContent}
    >
      {/* XP Float animations */}
      <AnimatePresence>
        {xpFloats.map(xp => (
          <motion.div
            key={xp.id}
            className="absolute top-4 right-4 z-20 font-display font-bold text-lg pointer-events-none"
            style={{ color: '#A78BFA' }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            +{xp.amount} XP ✨
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${gradient} p-5 relative`}>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 80% 20%, ${accentColor}15 0%, transparent 60%)`,
          }}
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex-1">
            {/* Category + difficulty */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`category-badge-${topic.category} px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1`}
              >
                <span>{getCategoryEmoji(topic.category)}</span>
                {getCategoryLabel(topic.category)}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3].map(d => (
                  <Circle
                    key={d}
                    size={7}
                    className={d <= topic.difficulty ? 'fill-current' : 'opacity-20'}
                    style={{ color: accentColor }}
                  />
                ))}
              </div>
            </div>

            {/* Topic name */}
            <h2 className="font-display font-bold text-xl leading-tight" style={{ color: 'var(--text-primary)' }}>
              {topic.name}
            </h2>
          </div>

          {/* Emoji */}
          <motion.div
            className="text-5xl flex-shrink-0"
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
          >
            {topic.emoji}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {loading && !content && (
          <div className="space-y-3">
            <div className="shimmer-card h-5 rounded-lg w-3/4" />
            <div className="shimmer-card h-4 rounded-lg w-full" />
            <div className="shimmer-card h-4 rounded-lg w-5/6" />
            <div className="shimmer-card h-4 rounded-lg w-full" />
          </div>
        )}

        {!content && !loading && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {topic.description}
          </p>
        )}

        {content && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {/* Hook */}
            <p className="text-base italic font-medium mb-4" style={{ color: accentColor }}>
              &ldquo;{content.hook}&rdquo;
            </p>

            {/* Explanation */}
            <div className="relative">
              <p
                className={cn(
                  'text-sm leading-relaxed transition-all duration-300',
                  !expanded && 'line-clamp-3'
                )}
                style={{ color: 'var(--text-secondary)' }}
              >
                {content.explanation}
              </p>

              {!expanded && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                  style={{ background: 'linear-gradient(transparent, var(--bg-card))' }}
                />
              )}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-semibold mt-2 mb-4"
              style={{ color: accentColor }}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? 'Show less' : 'Read more'}
            </button>

            {/* Key points */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 mb-4"
                >
                  {content.keyPoints.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="mt-0.5 text-base">•</span>
                      {point}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fun fact */}
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3 p-3 rounded-xl mb-4"
                style={{
                  background: `${accentColor}10`,
                  border: `1px solid ${accentColor}25`,
                }}
              >
                <Lightbulb size={16} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: '#F59E0B' }}>Fun fact: </span>
                  {content.funFact}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-2 mt-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => { handleRead(); if (!expanded) setExpanded(true) }}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200',
              read
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : 'hover:opacity-80'
            )}
            style={!read ? {
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
              color: accentColor,
            } : {}}
          >
            <BookOpen size={14} />
            {read ? '✓ Read' : '📖 +10 XP'}
          </button>

          <button
            onClick={() => { setShowQuiz(!showQuiz); loadContent() }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#A78BFA',
            }}
          >
            <Brain size={14} />
            🧠 Quiz
          </button>

          <button
            onClick={handleSave}
            className="flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 hover:scale-110"
            style={{
              background: saved ? 'rgba(139,92,246,0.2)' : 'var(--bg-elevated)',
              border: saved ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border)',
              color: saved ? '#A78BFA' : 'var(--text-muted)',
            }}
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Inline quiz */}
        <AnimatePresence>
          {showQuiz && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <QuizCard
                topic={topic}
                onXP={floatXP}
                onClose={() => setShowQuiz(false)}
                inline
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
