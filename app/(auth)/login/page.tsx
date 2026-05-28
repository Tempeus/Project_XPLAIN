'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/feed'
    }
  }

  const floatingCards = [
    { emoji: '🏦', label: 'US Treasury', color: '#3B82F6', x: '-20%', y: '10%', rotate: -8 },
    { emoji: '🛡️', label: 'Risk Management', color: '#EF4444', x: '75%', y: '20%', rotate: 6 },
    { emoji: '📊', label: 'Accounting', color: '#10B981', x: '60%', y: '70%', rotate: -5 },
  ]

  return (
    <div className="w-full max-w-md relative">
      {/* Floating preview cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
          style={{
            left: card.x,
            top: card.y,
            background: `rgba(19, 14, 32, 0.9)`,
            border: `1px solid ${card.color}40`,
            color: card.color,
            rotate: card.rotate,
            boxShadow: `0 4px 20px ${card.color}20`,
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        >
          <span>{card.emoji}</span>
          <span>{card.label}</span>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="card-base p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="text-5xl mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🧠
          </motion.div>
          <h1 className="text-3xl font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Finance, explained like you&apos;re 5
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pr-12"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm px-4 py-3 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          No account?{' '}
          <Link href="/signup" className="font-semibold" style={{ color: 'var(--primary-light)' }}>
            Create one free
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
