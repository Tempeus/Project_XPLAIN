import type { Metadata, Viewport } from 'next'
import { Sora, Space_Grotesk } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'XPLAIN · Learn Finance Like You\'re 5',
  description: 'Master Treasury, Risk Management & Accounting through bite-sized ELI5 explanations. Addictive. Rewarding. Actually fun.',
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0B0914',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
