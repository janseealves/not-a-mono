import { type HTMLAttributes, forwardRef } from 'react'

import { cx } from './cx'

// Sem shadow no base: profundidade varia por uso (painel inline vs. dropdown flutuante)
// e classes conflitantes de shadow não se resolvem de forma confiável sem tailwind-merge.
export const panelClass = 'rounded-lg border border-hair bg-surface'

export const Panel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cx(panelClass, className)} {...props} />,
)
Panel.displayName = 'Panel'
