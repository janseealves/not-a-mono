import { useEffect, useRef } from 'react'

import type { Message } from '../../state/conversation'
import { monoVoice } from '../../voice/mono'
import { MonoBadge } from '../mono/MonoBadge'
import { SectionLabel } from '../shell/SectionLabel'
import { Composer } from './Composer'
import { MessageBubble } from './MessageBubble'
import { ThinkingState } from './ThinkingState'

interface ChatPanelProps {
  messages: Message[]
  thinking: boolean
  hasSources: boolean
  onAsk: (query: string) => void
}

export function ChatPanel({ messages, thinking, hasSources, onAsk }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // mantém a conversa colada no fim
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, thinking])

  const lastMonoId = [...messages].reverse().find((m) => m.role === 'mono')?.id

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col">
      <header className="flex items-baseline justify-between border-b border-hair px-8 py-4">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-[11px] font-medium text-amber">01</span>
          <h1 className="font-display text-base font-medium lowercase tracking-[-0.03em] text-bone">
            rag
          </h1>
        </div>
        <SectionLabel>ingest → retrieve → reason → respond</SectionLabel>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-8">
        {messages.length === 0 && !thinking ? (
          <EmptyState hasSources={hasSources} />
        ) : (
          <div className="flex flex-col gap-8">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                withCursor={!thinking && m.id === lastMonoId}
              />
            ))}
            {thinking && <ThinkingState />}
          </div>
        )}
      </div>

      <Composer disabled={thinking} onSubmit={onAsk} />
    </section>
  )
}

function EmptyState({ hasSources }: { hasSources: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <MonoBadge size={72} />
      <div className="flex max-w-[44ch] flex-col gap-2 text-center">
        <p className="font-display text-[15px] font-light leading-relaxed text-bone">
          {monoVoice.emptyChat}
        </p>
        {!hasSources && (
          <p className="text-[12px] leading-relaxed text-slate">{monoVoice.emptyIndex}</p>
        )}
      </div>
    </div>
  )
}
