import { BottomTabBar } from '@/components/navigation/BottomTabBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-ocean-900">
      <div className="page-with-nav">{children}</div>
      <BottomTabBar />
    </div>
  )
}
