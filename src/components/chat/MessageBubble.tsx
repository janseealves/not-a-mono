import type { Message } from '../../state/conversation'
import { MonoBadge } from '../mono/MonoBadge'

interface MessageBubbleProps {
  message: Message
  /** cursor âmbar piscante — só na última fala do MONO */
  withCursor?: boolean
}

export function MessageBubble({ message, withCursor }: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] uppercase tracking-[0.22em] text-slate">
          // você
        </span>
        <p className="max-w-[60ch] text-sm leading-relaxed text-bone">
          <span className="select-none text-amber">&gt; </span>
          {message.text}
        </p>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <MonoBadge size={28} />
      <div className="flex min-w-0 flex-col gap-1.5 pt-0.5">
        <span className="font-display text-[9px] uppercase tracking-[0.22em] text-slate">
          mono
        </span>
        <p
          className={`max-w-[58ch] whitespace-pre-wrap font-display text-[15px] font-light leading-[1.5] tracking-[-0.01em] ${
            message.error ? 'text-ember' : 'text-bone'
          }`}
        >
          {message.text}
          {withCursor && <span className="mono-cursor" />}
        </p>
        {message.meta && (
          <span className="font-display text-[10px] tracking-[0.08em] text-slate">
            {message.meta}
          </span>
        )}
      </div>
    </div>
  )
}
