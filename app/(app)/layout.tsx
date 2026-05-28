import TopBar from '@/components/nav/TopBar'
import BottomNav from '@/components/nav/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <TopBar />
      <main
        className="max-w-lg mx-auto"
        style={{ paddingTop: '60px', paddingBottom: '65px', minHeight: '100vh' }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
