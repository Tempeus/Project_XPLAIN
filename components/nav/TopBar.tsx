'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TopBarProps {
  xp?: number
  streak?: number
}

export default function TopBar({ xp = 0, streak = 0 }: TopBarProps) {
  const [userXP, setUserXP] = useState(xp)
  const [userStreak, setUserStreak] = useState(streak)
  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('user_streaks')
        .select('xp, current_streak')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setUserXP(data.xp ?? 0)
        setUserStreak(data.current_streak ?? 0)
      }
    }
    loadStats()
  }, [supabase])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 glass safe-top"
      style={{ height: '60px', borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-lg mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <span className="font-display font-bold text-xl tracking-tight">
          ⚡ <span className="text-gradient">XPLAIN</span>
        </span>

        {/* Stats */}
        <div className="flex items-center gap-3">
          {userStreak > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#FCD34D' }}
            >
              🔥 {userStreak}
            </div>
          )}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#A78BFA' }}
          >
            ✨ {userXP.toLocaleString()} XP
          </div>
        </div>
      </div>
    </div>
  )
}
