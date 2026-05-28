'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, BookOpen, Brain, Bookmark, User } from 'lucide-react'

const TABS = [
  { href: '/feed', icon: Home, label: 'Home' },
  { href: '/daily', icon: BookOpen, label: 'Daily' },
  { href: '/quiz', icon: Brain, label: 'Quiz' },
  { href: '/saved', icon: Bookmark, label: 'Saved' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 glass safe-bottom"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-lg mx-auto flex items-center" style={{ height: '65px' }}>
        {TABS.map(tab => {
          const isActive = pathname.startsWith(tab.href)
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 relative py-2 transition-all duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-x-2 -top-px h-0.5 rounded-full"
                  style={{ background: 'var(--primary)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#8B5CF6' : '#64748B',
                }}
                transition={{ duration: 0.2 }}
                className={isActive ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]' : ''}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </motion.div>

              <motion.span
                animate={{
                  color: isActive ? '#A78BFA' : '#64748B',
                  fontWeight: isActive ? 700 : 500,
                }}
                className="text-[10px]"
                style={{ fontFamily: 'var(--font-space)' }}
              >
                {tab.label}
              </motion.span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
