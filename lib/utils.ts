import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGradientForCategory(category: string): string {
  switch (category) {
    case 'treasury':
      return 'from-blue-600/25 via-blue-900/15 to-indigo-950/30'
    case 'risk':
      return 'from-rose-600/25 via-red-900/15 to-orange-950/30'
    case 'accounting':
      return 'from-emerald-600/25 via-emerald-900/15 to-teal-950/30'
    default:
      return 'from-violet-600/25 via-purple-900/15 to-indigo-950/30'
  }
}

export function getCategoryAccentColor(category: string): string {
  switch (category) {
    case 'treasury': return '#3B82F6'
    case 'risk': return '#EF4444'
    case 'accounting': return '#10B981'
    default: return '#8B5CF6'
  }
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'treasury': return 'Treasury'
    case 'risk': return 'Risk Management'
    case 'accounting': return 'Accounting'
    default: return category
  }
}

export function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'treasury': return '💰'
    case 'risk': return '🛡️'
    case 'accounting': return '📊'
    default: return '📚'
  }
}

export function getXPForAction(action: 'read' | 'quiz_correct' | 'quiz_wrong' | 'daily'): number {
  switch (action) {
    case 'read': return 10
    case 'quiz_correct': return 20
    case 'quiz_wrong': return 5
    case 'daily': return 50
    default: return 0
  }
}

export function getLevelFromXP(xp: number): { level: number; title: string; nextXP: number } {
  const levels = [
    { min: 0, title: 'Finance Rookie' },
    { min: 500, title: 'Treasury Apprentice' },
    { min: 1500, title: 'Risk Analyst' },
    { min: 3000, title: 'CFO in Training' },
    { min: 6000, title: 'Wall Street Wizard' },
  ]
  let current = levels[0]
  let nextMin = levels[1].min
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].min) {
      current = levels[i]
      nextMin = levels[i + 1]?.min ?? current.min + 5000
    }
  }
  return { level: levels.indexOf(current) + 1, title: current.title, nextXP: nextMin }
}

export function hashStringToColor(str: string): string {
  const colors = ['#8B5CF6', '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#EC4899', '#06B6D4']
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
