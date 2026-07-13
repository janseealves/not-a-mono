import { useCallback, useEffect, useState } from 'react'

import { type AgentMessage, readMessages, writeMessages } from '../lib/agentStorage'
import { getActiveStream, subscribeToStream } from '../lib/agentStreamRegistry'

export function useThreadMessages(threadId: string | null) {
  const [messages, setMessages] = useState<AgentMessage[]>(() =>
    threadId ? readMessages(threadId) : [],
  )
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  // Reseta durante o render quando a thread muda, em vez de via useEffect —
  // padrão do React pra "resetar" estado a partir de uma prop.
  const [readFor, setReadFor] = useState(threadId)
  if (threadId !== readFor) {
    setReadFor(threadId)
    setMessages(threadId ? readMessages(threadId) : [])
    setStreamingMessageId(null)
  }

  // A thread pode ter uma resposta em andamento de antes desta montagem (ex.:
  // o usuário trocou de thread no meio do streaming e voltou) — reflete o
  // progresso ao vivo em vez de esperar o próximo reload.
  useEffect(() => {
    if (!threadId) return
    const inFlight = getActiveStream(threadId)
    if (!inFlight) return

    // subscribeToStream chama o listener imediatamente com o estado atual —
    // por isso os setState ficam só aqui dentro, nunca direto no corpo do
    // efeito (é o callback disparado pelo sistema externo, não o mount).
    const sync = (state: { content: string; sources?: AgentMessage['sources']; done: boolean; error?: boolean }) => {
      setStreamingMessageId(state.done ? null : inFlight.messageId)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === inFlight.messageId
            ? { ...m, content: state.content, sources: state.sources ?? m.sources, error: state.error }
            : m,
        ),
      )
    }
    return subscribeToStream(threadId, sync)
  }, [threadId])

  const addMessage = useCallback(
    (message: AgentMessage) => {
      if (!threadId) return
      setMessages((prev) => {
        const next = [...prev, message]
        writeMessages(threadId, next)
        return next
      })
    },
    [threadId],
  )

  // Só atualiza o estado em memória (re-render) — não persiste. Usado pra
  // refletir o buffer ao vivo de agentStreamRegistry; a persistência dos
  // checkpoints (fontes, fim, erro) é feita pelo próprio registry.
  const syncMessage = useCallback((id: string, patch: Partial<AgentMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }, [])

  // Estado + persistência num só passo — usado por respostas locais (ex.: o
  // comando /help, que não passa pelo registry e por isso precisa persistir
  // seu próprio checkpoint final).
  const commitMessage = useCallback(
    (id: string, patch: Partial<AgentMessage>) => {
      if (!threadId) return
      setMessages((prev) => {
        const next = prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
        writeMessages(threadId, next)
        return next
      })
    },
    [threadId],
  )

  return { messages, streamingMessageId, addMessage, syncMessage, commitMessage }
}
