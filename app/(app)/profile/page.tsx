'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getLevelFromXP, hashStringToColor, getInitials, getCategoryAccentColor } from '@/lib/utils'
import { TOPICS_BY_CATEGORY } from '@/lib/topics'

interface ProfileData {
  name: string
  email: string
  joinedAt: string
  xp: number
  currentStreak: number
  longestStreak: number
  topicsRead: number
  progress: { treasury: number; risk: number; accounting: number }
  streakDays: boolean[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [streakRes, progressRes] = await Promise.all([
        supabase.from('user_streaks').select('*').eq('user_id', user.id).single(),
        supabase.from('user_progress').select('topic_id, mastery_score, cards_read').eq('user_id', user.id),
      ])

      const streakData = streakRes.data
      const progressData = progressRes.data ?? []

      const cats = { treasury: 0, risk: 0, accounting: 0 }
      const counts = { treasury: 0, risk: 0, accounting: 0 }
      let totalRead = 0

      for (const row of progressData) {
        const cat = row.topic_id.split('-')[0] as keyof typeof cats
        if (cat in cats) {
          cats[cat] += row.mastery_score
          counts[cat]++
        }
        totalRead += row.cards_read
      }

      // Generate last 7 days streak display
      const streakDays = Array.from({ length: 7 }, (_, i) => {
        if (!streakData?.last_activity_date) return false
        const dayDiff = i
        const streak = streakData.current_streak ?? 0
        return dayDiff < streak
      }).reverse()

      setProfile({
        name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Learner',
        email: user.email ?? '',
        joinedAt: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        xp: streakData?.xp ?? 0,
        currentStreak: streakData?.current_streak ?? 0,
        longestStreak: streakData?.longest_streak ?? 0,
        topicsRead: totalRead,
        progress: {
          treasury: counts.treasury ? Math.round(cats.treasury / counts.treasury) : 0,
          risk: counts.risk ? Math.round(cats.risk / counts.risk) : 0,
          accounting: counts.accounting ? Math.round(cats.accounting / counts.accounting) : 0,
        },
        streakDays,
      })
      setLoading(false)
    }
    load()
  }, [supabase])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="shimmer-card h-32 rounded-2xl" />
        <div className="shimmer-card h-24 rounded-2xl" />
        <div className="shimmer-card h-40 rounded-2xl" />
      </div>
    )
  }

  if (!profile) return null

  const { level, title, nextXP } = getLevelFromXP(profile.xp)
  const avatarColor = hashStringToColor(profile.email)
  const initials = getInitials(profile.name)
  const xpToNext = nextXP - profile.xp
  const xpProgress = Math.min(100, Math.round(((profile.xp % 500) / 500) * 100))

  const categories = ['treasury', 'risk', 'accounting'] as const
  const categoryLabels = { treasury: '💰 Treasury', risk: '🛡️ Risk', accounting: '📊 Accounting' }
  const totalTopics = Object.values(TOPICS_BY_CATEGORY).reduce((s, t) => s + t.length, 0)

  return (
    <div className="p-4 pb-6 space-y-4">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-5"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-display font-bold text-white flex-shrink-0"
            style={{ background: avatarColor, boxShadow: `0 8px 25px ${avatarColor}50` }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {initials}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-xl truncate" style={{ color: 'var(--text-primary)' }}>
              {profile.name}
            </h1>
            <p className="text-xs truncate mb-2" style={{ color: 'var(--text-muted)' }}>{profile.email}</p>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA' }}>
                Lv.{level} · {title}
              </span>
            </div>
          </div>
        </div>

        {/* XP progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>✨ {profile.xp.toLocaleString()} XP</span>
            <span>{xpToNext.toLocaleString()} XP to next level</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: 'Current Streak', value: `${profile.currentStreak}🔥`, color: '#F59E0B' },
          { label: 'Best Streak', value: `${profile.longestStreak}🏆`, color: '#A78BFA' },
          { label: 'Topics Read', value: `${profile.topicsRead}📖`, color: '#10B981' },
        ].map((stat, i) => (
          <div key={i} className="card-base p-3 text-center">
            <p className="font-display font-bold text-lg" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* 7-day streak calendar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-base p-4"
      >
        <h2 className="font-display font-bold text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Last 7 Days
        </h2>
        <div className="flex justify-between">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: profile.streakDays[i] ? 'rgba(245,158,11,0.2)' : 'var(--bg-elevated)',
                  border: profile.streakDays[i] ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--border)',
                }}
                animate={profile.streakDays[i] ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              >
                <span className="text-base">{profile.streakDays[i] ? '🔥' : '·'}</span>
              </motion.div>
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Category mastery */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-base p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Knowledge Mastery
          </h2>
          <TrendingUp size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="space-y-3">
          {categories.map((cat, i) => {
            const pct = profile.progress[cat]
            const accentColor = getCategoryAccentColor(cat)
            return (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: 'var(--text-secondary)' }}>{categoryLabels[cat]}</span>
                  <span style={{ color: accentColor }}>{pct}%</span>
                </div>
                <div className="progress-bar" style={{ height: 6 }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    style={{ background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
          {Object.values(profile.progress).filter(p => p >= 80).length} / 3 categories mastered
          · {totalTopics} total topics
        </p>
      </motion.div>

      {/* Sign out */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}
      >
        <LogOut size={14} />
        Sign Out
      </motion.button>
    </div>
  )
}
