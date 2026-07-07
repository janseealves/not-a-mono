import { type InputHTMLAttributes, forwardRef } from 'react'

import { cx } from './cx'

const inputClass =
  'rounded-card border border-hair bg-surface px-3 py-2 text-[12px] text-bone placeholder:text-slate/50 focus:border-steel focus:outline-none disabled:opacity-50'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cx(inputClass, className)} {...props} />,
)
Input.displayName = 'Input'
