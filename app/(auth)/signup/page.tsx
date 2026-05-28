'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/feed'
    }
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="card-base p-8"
      >
        {/* Social proof badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold mx-auto w-fit"
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#6EE7B7',
          }}
        >
          <Users size={12} />
          Join 10,000+ finance learners
        </motion.div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🚀</div>
          <h1 className="text-3xl font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Start learning
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Free forever. No finance degree required.
          </p>
        </div>

        {/* XP preview */}
        <div className="flex gap-3 mb-6">
          {[
            { icon: '⚡', label: '+50 XP on signup', color: '#8B5CF6' },
            { icon: '🔥', label: 'Daily streak bonus', color: '#F59E0B' },
            { icon: '🧠', label: 'Quiz rewards', color: '#10B981' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex-1 text-center p-2 rounded-xl"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-[10px] font-medium" style={{ color: item.color }}>
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Alex Johnson"
              className="input-field"
              required
              autoComplete="name"
            />
          </div>

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
                placeholder="Min. 8 characters"
                className="input-field pr-12"
                required
                minLength={8}
                autoComplete="new-password"
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
            {loading ? 'Creating account...' : 'Create Free Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--primary-light)' }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
