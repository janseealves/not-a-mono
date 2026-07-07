import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

import { cx } from './cx'

const button = cva(
  'inline-flex items-center justify-center gap-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'rounded-card bg-amber text-ground hover:bg-ember disabled:opacity-25',
        secondary:
          'rounded-card border border-steel px-3 py-2 font-display text-[10px] font-medium uppercase tracking-[0.18em] text-bone hover:border-amber hover:text-amber',
        ghost:
          'rounded-lg border border-hair px-3 py-1 text-[11px] text-slate hover:border-slate/40 hover:text-bone data-[active=true]:border-amber data-[active=true]:text-amber',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  active?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, active, ...props }, ref) => (
    <button
      ref={ref}
      data-active={active}
      className={cx(button({ variant }), className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
