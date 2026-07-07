import { type HTMLAttributes } from 'react'

import { cx } from './cx'

// Sem variant: só um estilo de readout em uso agora (headers de seção do
// SourcesControl). Se aparecer um segundo padrão real, aí vira cva de novo.
export function Label({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cx('text-[10px] font-medium uppercase tracking-[0.22em] text-slate', className)}
      {...props}
    />
  )
}
