'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import TopicCard from '@/components/cards/TopicCard'
import type { Topic } from '@/lib/types'

interface FeedProps {
  topics: Topic[]
}

const FILTERS = [
  { key: 'all', label: 'All', emoji: '✨' },
  { key: 'treasury', label: 'Treasury', emoji: '💰' },
  { key: 'risk', label: 'Risk', emoji: '🛡️' },
  { key: 'accounting', label: 'Accounting', emoji: '📊' },
]

export default function Feed({ topics }: FeedProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const filtered = useMemo(
    () => activeFilter === 'all' ? topics : topics.filter(t => t.category === activeFilter),
    [topics, activeFilter]
  )

  function handleFilterChange(key: string) {
    setActiveFilter(key)
    setCurrentIndex(0)
  }

  function goNext() {
    if (currentIndex < filtered.length - 1) {
      setDirection(1)
      setCurrentIndex(i => i + 1)
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(i => i - 1)
    }
  }

  const topic = filtered[currentIndex]

  return (
    <div>
      {/* Category filter pills */}
      <div className="sticky top-[60px] z-40 py-3 px-4 glass" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {FILTERS.map(f => (
            <motion.button
              key={f.key}
              onClick={() => handleFilterChange(f.key)}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: activeFilter === f.key ? 'var(--primary)' : 'var(--bg-elevated)',
                color: activeFilter === f.key ? 'white' : 'var(--text-muted)',
                boxShadow: activeFilter === f.key ? '0 4px 15px rgba(139,92,246,0.35)' : 'none',
                border: activeFilter === f.key ? 'none' : '1px solid var(--border)',
              }}
            >
              <span>{f.emoji}</span>
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
            No topics found
          </p>
        </div>
      ) : (
        <>
          {/* Single card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={topic.id}
              custom={direction}
              variants={{
                enter: (d: number) => ({ x: d * 60, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({ x: -d * 60, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <TopicCard topic={topic} index={0} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between px-6 pb-6 pt-1">
            <motion.button
              onClick={goPrev}
              disabled={currentIndex === 0}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              <ChevronLeft size={16} />
              Prev
            </motion.button>

            <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {currentIndex + 1} / {filtered.length}
            </span>

            <motion.button
              onClick={goNext}
              disabled={currentIndex === filtered.length - 1}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              Next
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </>
      )}
    </div>
  )
}
