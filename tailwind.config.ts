import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        xplain: {
          base: '#0B0914',
          card: '#130E20',
          elevated: '#1A1535',
          border: '#2D2B4E',
          'border-bright': '#4A4780',
        },
        treasury: '#3B82F6',
        risk: '#EF4444',
        accounting: '#10B981',
      },
      fontFamily: {
        sans: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'xp-float': 'xpFloat 1.5s ease-out forwards',
        shimmer: 'shimmer 1.8s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.7)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          from: { opacity: '0', transform: 'scale(0.7)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        xpFloat: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '80%': { opacity: '1', transform: 'translateY(-60px) scale(1.2)' },
          '100%': { opacity: '0', transform: 'translateY(-80px) scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}

export default config
