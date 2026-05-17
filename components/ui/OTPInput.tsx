'use client'

import { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  onComplete: (otp: string) => void
  disabled?: boolean
}

export function OTPInput({ length = 6, onComplete, disabled = false }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newValues = [...values]
    newValues[index] = digit
    setValues(newValues)

    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }

    if (newValues.every(v => v !== '')) {
      onComplete(newValues.join(''))
    }
  }, [values, length, onComplete])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputs.current[index - 1]?.focus()
      const newValues = [...values]
      newValues[index - 1] = ''
      setValues(newValues)
    }
  }, [values])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const newValues = [...pasted.padEnd(length, '').slice(0, length).split('')]
    setValues(newValues)
    const nextEmpty = newValues.findIndex(v => !v)
    inputs.current[nextEmpty === -1 ? length - 1 : nextEmpty]?.focus()
    if (pasted.length === length) onComplete(pasted)
  }, [length, onComplete])

  return (
    <div className="flex items-center gap-2.5 justify-center" dir="ltr">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={values[i]}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={cn('otp-box', values[i] && 'filled')}
        />
      ))}
    </div>
  )
}
