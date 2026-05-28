'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Bookmark, ChevronRight, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getTopicById } from '@/lib/topics'
import { getCategoryAccentColor, getCategoryLabel, getCategoryEmoji } from '@/lib/utils'
import type { Topic } from '@/lib/types'

export default function SavedPage() {
  const [saved, setSaved] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('bookmarks')
        .select('topic_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        const topics = data
          .map(row => getTopicById(row.topic_id))
          .filter((t): t is Topic => t !== undefined)
        setSaved(topics)
      }
      setLoading(false)
    }
    load()
  }, [supabase])

  return (
    <div className="p-4 pb-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
          Saved 🔖
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Your bookmarked topics
        </p>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="shimmer-card h-20 rounded-2xl" />)}
        </div>
      ) : saved.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🔖
          </motion.div>
          <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
            Nothing saved yet
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Tap 🔖 on any card to save topics for later
          </p>
          <Link href="/feed">
            <button className="btn-primary flex items-center gap-2">
              Explore topics <ArrowRight size={14} />
            </button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {saved.map((topic, i) => {
            const accentColor = getCategoryAccentColor(topic.category)
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/quiz/${topic.id}`}>
                  <div
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:opacity-90"
                    style={{ background: 'var(--bg-card)', border: `1px solid ${accentColor}20` }}
                  >
                    <span className="text-3xl">{topic.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <span className={`category-badge-${topic.category} px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 mb-1`}>
                        {getCategoryEmoji(topic.category)} {getCategoryLabel(topic.category)}
                      </span>
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                        {topic.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Bookmark size={14} className="fill-current" style={{ color: accentColor }} />
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
