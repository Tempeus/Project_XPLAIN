'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
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

  const filtered = useMemo(() =>
    activeFilter === 'all'
      ? topics
      : topics.filter(t => t.category === activeFilter),
    [topics, activeFilter]
  )

  return (
    <div>
      {/* Category filter pills */}
      <div className="sticky top-[60px] z-40 py-3 px-4 glass" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {FILTERS.map(f => (
            <motion.button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
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

      {/* Feed cards */}
      <div className="pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
              No topics found
            </p>
          </div>
        ) : (
          filtered.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} index={i} />
          ))
        )}
      </div>
    </div>
  )
}
