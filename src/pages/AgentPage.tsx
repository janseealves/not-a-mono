import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import { CommandText } from '../components/chat/CommandText'
import { Composer } from '../components/chat/Composer'
import { MessageBubble } from '../components/chat/MessageBubble'
import { ThinkingState } from '../components/chat/ThinkingState'
import { MonoBadge } from '../components/mono/MonoBadge'
import type { ThreadsApi } from '../components/shell/AppShell'
import { HealthDot } from '../components/shell/HealthDot'
import { SidebarMenuButton } from '../components/shell/SidebarShell'
import { SourcesControl } from '../components/shell/SourcesControl'
import { useAgentChat } from '../hooks/useAgentChat'
import { useCollection } from '../hooks/useCollection'
import { useHealth } from '../hooks/useHealth'
import { useSources } from '../hooks/useSources'
import { useThreadMessages } from '../hooks/useThreadMessages'
import { fakeStream } from '../lib/fakeStream'
import { agentVoice } from '../voice/agent'

export function AgentPage() {
  const threadsApi = useOutletContext<ThreadsApi>()
  const { threads, activeThreadId, createThread, setActiveThreadId } = threadsApi
  const thread = threads.find((t) => t.id === activeThreadId)

  const { online } = useHealth()
  const { collectionId, invalidate: invalidateCollection } = useCollection()
  const { sources, addSource } = useSources(collectionId)
  const { messages, streamingMessageId, addMessage, syncMessage, commitMessage } = useThreadMessages(
    thread?.id ?? null,
  )
  const { send, pending } = useAgentChat({
    threadId: thread?.id ?? null,
    collectionId,
    messageCount: messages.length,
    addMessage,
    syncMessage,
    touchThread: threadsApi.touchThread,
    onCollectionMissing: invalidateCollection,
  })
  // Comando local (/help) não bate no backend — encena o mesmo streaming.
  const [commandPending, setCommandPending] = useState(false)
  const disabled = pending || streamingMessageId !== null || commandPending
  const scrollRef = useRef<HTMLDivElement>(null)
  // Só protege a criação (não a troca) contra o double-invoke do StrictMode:
  // escolher uma thread já existente é idempotente, chamar createThread()
  // duas vezes não seria.
  const createdRef = useRef(false)

  // Resolve qual thread mostrar sempre que a ativa some da lista (thread nova
  // sem nenhuma ainda, ou a ativa foi apagada) — sem isso virar rota, é aqui
  // que mora a lógica que antes ficava em AgentIndexRedirect.
  useEffect(() => {
    const activeExists = activeThreadId && threads.some((t) => t.id === activeThreadId)
    if (activeExists) return
    if (threads.length > 0) {
      setActiveThreadId(threads[0].id)
      return
    }
    if (createdRef.current) return
    createdRef.current = true
    setActiveThreadId(createThread().id)
  }, [activeThreadId, threads, createThread, setActiveThreadId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, disabled])

  if (!thread) return null

  const lastAgentId = [...messages].reverse().find((m) => m.role === 'agent')?.id

  const streamLocalReply = async (text: string) => {
    const id = crypto.randomUUID()
    addMessage({ id, role: 'agent', content: '', createdAt: new Date().toISOString() })
    setCommandPending(true)
    let content = ''
    for await (const token of fakeStream(text)) {
      content += token
      syncMessage(id, { content })
    }
    commitMessage(id, { content })
    setCommandPending(false)
  }

  const handleSubmit = (query: string) => {
    if (query.toLowerCase() === '/help') {
      addMessage({ id: crypto.randomUUID(), role: 'user', content: query, createdAt: new Date().toISOString() })
      void streamLocalReply(agentVoice.help)
      return
    }
    void send(query)
  }

  const empty = messages.length === 0 && !disabled

  return (
    <div className="relative flex h-full flex-col">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 pt-3">
        <div className="mx-auto w-full max-w-3xl px-4">
          {/* pl-3 (não pl-4) só no mobile: compensa o padding próprio do
              SidebarMenuButton (invisível no desktop) pra centralizar o
              ícone com o MonoBadge das mensagens abaixo. */}
          <div className="pointer-events-auto flex items-center justify-between rounded-lg border border-hair bg-surface/80 py-2.5 pl-3 pr-4 shadow-sm shadow-black/5 backdrop-blur-md md:pl-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <SidebarMenuButton />
              <span className="truncate text-[13px] text-bone">{thread.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <SourcesControl
                collectionId={collectionId}
                sources={sources}
                online={online}
                onIngested={addSource}
              />
              <HealthDot online={online} />
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
              <WelcomeMessage />
            ) : (
              messages.map((m) => {
                const awaitingFirstToken =
                  m.role === 'agent' && m.content === '' && disabled && m.id === lastAgentId
                return awaitingFirstToken ? (
                  <ThinkingState key={m.id} />
                ) : (
                  <MessageBubble key={m.id} message={m} withCursor={disabled && m.id === lastAgentId} />
                )
              })
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-5 pt-1">
        <Composer disabled={disabled} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

function WelcomeMessage() {
  return (
    <div className="flex gap-3">
      <MonoBadge size={26} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate">mono</span>
        <p className="max-w-[60ch] whitespace-pre-wrap text-[15px] leading-relaxed tracking-[-0.01em] text-bone">
          {agentVoice.welcome}
        </p>
        <p className="text-[11px] uppercase tracking-[0.14em] text-slate/60">
          <CommandText text={agentVoice.helpHint} />
        </p>
      </div>
    </div>
  )
}
