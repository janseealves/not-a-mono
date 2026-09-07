import type { AgentMessage } from '../../lib/agentStorage'
import { MonoBadge } from '../mono/MonoBadge'
import { CommandText } from './CommandText'
import { Markdown } from './Markdown'
import { SourceReferences } from './SourceReferences'

interface MessageBubbleProps {
  message: AgentMessage
  /** cursor laranja piscante — só na última fala do agente */
  withCursor?: boolean
}

export function MessageBubble({ message, withCursor }: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap rounded-lg rounded-br-sm border border-hair bg-surface px-4 py-2.5 text-sm leading-relaxed text-bone">
          <CommandText text={message.content} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <MonoBadge size={26} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate">mono</span>
        <div
          className={`max-w-[60ch] text-[15px] leading-relaxed tracking-[-0.01em] ${
            message.error ? 'text-ember' : 'text-bone'
          }`}
        >
          {/* div, não p: markdown gera blocos (p, ul, pre) e bloco dentro de
              <p> é HTML inválido — o navegador fecha o parágrafo sozinho e a
              árvore do DOM sai diferente do que o React espera. */}
          <Markdown streaming={withCursor}>{message.content}</Markdown>
          {withCursor && <span className="mono-cursor" />}
        </div>
        {message.sources && message.sources.length > 0 && (
          <SourceReferences sources={message.sources} />
        )}
      </div>
    </div>
  )
}
