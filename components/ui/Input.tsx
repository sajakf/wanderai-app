'use client'

import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
  rightElement?: React.ReactNode
}

export function Input({ label, error, icon: Icon, rightElement, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-text tracking-wider uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-text pointer-events-none">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        <input
          className={cn(
            'input-ocean w-full rounded-2xl px-4 py-3.5 text-sm',
            Icon && 'pl-11',
            rightElement && 'pr-12',
            error && 'border-danger/60 focus:border-danger focus:shadow-none',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
    </div>
  )
}
