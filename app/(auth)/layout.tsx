'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: 'var(--bg-base)' }}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
            top: '-10%',
            left: '-10%',
          }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
            bottom: '10%',
            right: '-5%',
          }}
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #10B981 0%, transparent 70%)',
            top: '50%',
            left: '60%',
          }}
          animate={{ x: [0, 20, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-2xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            ⚡ <span className="text-gradient">XPLAIN</span>
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  )
}
