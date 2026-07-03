import { useEffect, useReducer, useRef, useState } from 'react'

import { ApiError } from '../api/client'
import { Composer } from '../components/chat/Composer'
import { MessageBubble } from '../components/chat/MessageBubble'
import { ThinkingState } from '../components/chat/ThinkingState'
import { MonoBadge } from '../components/mono/MonoBadge'
import { HealthDot } from '../components/shell/HealthDot'
import { SourcesControl } from '../components/shell/SourcesControl'
import { Wordmark } from '../components/shell/Wordmark'
import { type AskResult, useAsk } from '../hooks/useAsk'
import { useCollection } from '../hooks/useCollection'
import { useHealth } from '../hooks/useHealth'
import { useSources } from '../hooks/useSources'
import { conversationReducer, messageId } from '../state/conversation'
import { monoLatency, monoVoice } from '../voice/mono'

export function RagPage() {
  const [messages, dispatch] = useReducer(conversationReducer, [])
  const [topK, setTopK] = useState(5)
  const { online } = useHealth()
  const { collectionId } = useCollection()
  const { sources, addSource } = useSources()
  const askMutation = useAsk()
  const scrollRef = useRef<HTMLDivElement>(null)

  const empty = messages.length === 0 && !askMutation.isPending

  // mantém a conversa colada no fim
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, askMutation.isPending])

  const lastMonoId = [...messages].reverse().find((m) => m.role === 'mono')?.id

  const handleAsk = (query: string) => {
    if (!collectionId) return
    dispatch({ type: 'push', message: { id: messageId(), role: 'user', text: query } })

    const monoId = messageId()
    dispatch({ type: 'push', message: { id: monoId, role: 'mono', text: '' } })

    askMutation.mutate(
      {
        collectionId,
        query,
        topK,
        onToken: (token) => dispatch({ type: 'append', id: monoId, text: token }),
      },
      {
        onSuccess: (result: AskResult) => {
          dispatch({
            type: 'patch',
            id: monoId,
            patch: { meta: monoLatency(result.latencyMs, result.topK), run: result },
          })
        },
        onError: (error) => {
          const offline = error instanceof ApiError && error.isOffline
          dispatch({
            type: 'patch',
            id: monoId,
            patch: {
              text: offline ? monoVoice.backendDown : monoVoice.askFailed,
              error: true,
            },
          })
        },
      },
    )
  }

  return (
    <div className="relative flex h-full flex-col">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 pt-3">
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="pointer-events-auto flex items-center justify-between rounded-lg border border-hair bg-surface/80 px-4 py-2.5 shadow-sm shadow-black/5 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <MonoBadge size={24} />
              <Wordmark />
              <span className="text-[11px] lowercase tracking-[0.1em] text-slate">
                · rag
              </span>
            </div>
            <div className="flex items-center gap-4">
              <HealthDot online={online} />
              <SourcesControl
                collectionId={collectionId}
                topK={topK}
                onTopKChange={setTopK}
                sources={sources}
                online={online}
                onIngested={addSource}
              />
            </div>
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable_both-edges]"
      >
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col pl-8 pr-4">
          {empty ? (
            <EmptyState hasSources={sources.length > 0} />
          ) : (
            <div className="flex flex-1 flex-col gap-7 pb-8 pt-20">
              {messages.map((m) => {
                // enquanto o token do stream ainda não chegou, mostra o "pensando"
                // no lugar da bolha vazia do mono
                const awaitingFirstToken =
                  m.role === 'mono' &&
                  m.text === '' &&
                  askMutation.isPending &&
                  m.id === lastMonoId
                return awaitingFirstToken ? (
                  <ThinkingState key={m.id} />
                ) : (
                  <MessageBubble
                    key={m.id}
                    message={m}
                    withCursor={askMutation.isPending && m.id === lastMonoId}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-5 pt-1">
        <Composer disabled={askMutation.isPending || !collectionId} onSubmit={handleAsk} />
      </div>
    </div>
  )
}

function EmptyState({ hasSources }: { hasSources: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-16 text-center">
      <MonoBadge size={64} />
      <div className="flex max-w-[40ch] flex-col gap-2">
        <p className="text-[17px] leading-relaxed text-bone">{monoVoice.emptyChat}</p>
        {!hasSources && (
          <p className="text-[13px] leading-relaxed text-slate">{monoVoice.emptyIndex}</p>
        )}
      </div>
    </div>
  )
}
