'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'danger' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'gold',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 select-none cursor-pointer'

  const variants = {
    gold:   'btn-gold',
    ghost:  'btn-ghost',
    danger: 'bg-danger/10 border border-danger/40 text-danger hover:bg-danger/20',
    subtle: 'bg-ocean-700/60 text-cream/70 hover:bg-ocean-700 hover:text-cream border border-ocean-600/40',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3.5 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
