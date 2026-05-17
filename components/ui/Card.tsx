import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  glass?: boolean
  onClick?: () => void
}

export function Card({ children, className, glass = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        glass ? 'glass-card' : 'bg-ocean-card border border-gold-subtle',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-2xl', className)} />
}
