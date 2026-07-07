import { cva, type VariantProps } from 'class-variance-authority'

import { cx } from './cx'

const dot = cva('h-1.5 w-1.5 rounded-full', {
  variants: {
    tone: {
      online: 'bg-amber shadow-[0_0_8px_rgba(234,88,12,0.5)]',
      offline: 'bg-ember',
    },
  },
})

export interface DotProps extends VariantProps<typeof dot> {
  className?: string
}

export function Dot({ tone, className }: DotProps) {
  return <span className={cx(dot({ tone }), className)} />
}
