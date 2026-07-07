import { useEffect, useReducer, useRef, useState } from 'react'

import { ApiError } from '../api/client'
import { CommandText } from '../components/chat/CommandText'
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
import { fakeStream } from '../lib/fakeStream'
import { conversationReducer, messageId } from '../state/conversation'
import { monoLatency, monoVoice } from '../voice/mono'

export function RagPage() {
  const [messages, dispatch] = useReducer(conversationReducer, [])
  // Fixo — o usuário não escolhe top_k, é detalhe de implementação da busca.
  const topK = 5
  const { online } = useHealth()
  const { collectionId } = useCollection()
  const { sources, addSource } = useSources(collectionId)
  const askMutation = useAsk()
  // Comandos locais (ex.: /help) não passam pelo askMutation — não batem no
  // backend — mas ainda encenam o mesmo streaming, então têm seu próprio pending.
  const [commandPending, setCommandPending] = useState(false)
  const pending = askMutation.isPending || commandPending
  const scrollRef = useRef<HTMLDivElement>(null)

  const empty = messages.length === 0 && !pending

  // mantém a conversa colada no fim
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, pending])

  const lastMonoId = [...messages].reverse().find((m) => m.role === 'mono')?.id

  // Encena um texto local como se fosse uma resposta em stream — usado pelos
  // comandos do chat (/help), que não têm nada pra buscar no backend.
  const streamLocalReply = async (text: string) => {
    const monoId = messageId()
    dispatch({ type: 'push', message: { id: monoId, role: 'mono', text: '' } })
    setCommandPending(true)
    for await (const token of fakeStream(text)) {
      dispatch({ type: 'append', id: monoId, text: token })
    }
    setCommandPending(false)
  }

  const handleAsk = (query: string) => {
    dispatch({ type: 'push', message: { id: messageId(), role: 'user', text: query } })

    // Comando local — não bate no backend, só ensina a usar o resto.
    if (query.toLowerCase() === '/help') {
      void streamLocalReply(monoVoice.help)
      return
    }

    // A collection ainda não ficou pronta (backend fora do ar, CORS, etc.) —
    // mesma leitura de "sem resposta" que um /ask falho daria.
    if (!collectionId) {
      dispatch({
        type: 'push',
        message: { id: messageId(), role: 'mono', text: monoVoice.backendDown, error: true },
      })
      return
    }

    const monoId = messageId()
    dispatch({ type: 'push', message: { id: monoId, role: 'mono', text: '' } })
    // Sem fontes nesta collection — encena a resposta padrão (mesmo streaming,
    // mesmo tom) em vez de bater no backend só pra ele dizer a mesma coisa.
    const isEmptyCollection = sources.length === 0

    askMutation.mutate(
      {
        collectionId,
        query,
        topK,
        empty: isEmptyCollection,
        onToken: (token) => dispatch({ type: 'append', id: monoId, text: token }),
      },
      {
        onSuccess: (result: AskResult) => {
          dispatch({
            type: 'patch',
            id: monoId,
            patch: {
              meta: monoLatency(result.latencyMs, result.topK),
              run: result,
              error: isEmptyCollection,
            },
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
          <div className="flex flex-1 flex-col gap-7 pb-8 pt-20">
            {empty ? (
              <WelcomeMessage hasSources={sources.length > 0} />
            ) : (
              messages.map((m) => {
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
                    withCursor={pending && m.id === lastMonoId}
                  />
                )
              })
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-5 pt-1">
        <Composer disabled={pending} onSubmit={handleAsk} />
      </div>
    </div>
  )
}

// A primeira mensagem é do mono, não uma splash screen — mesma marcação de
// uma resposta real, só que estática e fora do reducer (não é uma Message).
function WelcomeMessage({ hasSources }: { hasSources: boolean }) {
  return (
    <div className="flex gap-3">
      <MonoBadge size={26} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate">mono</span>
        <p className="max-w-[60ch] whitespace-pre-wrap text-[15px] leading-relaxed tracking-[-0.01em] text-bone">
          {monoVoice.welcome}
        </p>
        {!hasSources && (
          <p className="text-[13px] leading-relaxed text-slate">{monoVoice.emptyIndex}</p>
        )}
        <p className="text-[11px] uppercase tracking-[0.14em] text-slate/60">
          <CommandText text={monoVoice.helpHint} />
        </p>
      </div>
    </div>
  )
}
