import { useCallback, useState } from 'react'

import { streamChat } from '../api/agent'
import { ApiError } from '../api/client'
import { type AgentMessage, type Thread, deriveTitle } from '../lib/agentStorage'
import { runAgentStream } from '../lib/agentStreamRegistry'
import { agentVoice } from '../voice/agent'

interface UseAgentChatParams {
  threadId: string | null
  collectionId: string | null
  messageCount: number
  addMessage: (message: AgentMessage) => void
  syncMessage: (id: string, patch: Partial<AgentMessage>) => void
  touchThread: (id: string, patch?: Partial<Pick<Thread, 'title'>>) => void
}

export function useAgentChat({
  threadId,
  collectionId,
  messageCount,
  addMessage,
  syncMessage,
  touchThread,
}: UseAgentChatParams) {
  const [pending, setPending] = useState(false)

  const send = useCallback(
    async (content: string) => {
      if (!threadId || pending) return
      const isFirst = messageCount === 0

      addMessage({
        id: crypto.randomUUID(),
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      })
      touchThread(threadId, isFirst ? { title: deriveTitle(content) } : undefined)

      const agentMessageId = crypto.randomUUID()
      addMessage({ id: agentMessageId, role: 'agent', content: '', createdAt: new Date().toISOString() })

      setPending(true)
      const events = streamChat({ message: content, thread_id: threadId, collection_id: collectionId })
      await runAgentStream(
        threadId,
        agentMessageId,
        events,
        // A rota resolve collection_id antes de abrir o stream. Com a base
        // fixa, um 404 aqui é configuração errada (VITE_COLLECTION_ID) ou
        // currículo não indexado — nada que o visitante resolva tentando de
        // novo, então só informa em vez de reprovisionar.
        (err) => {
          if (err instanceof ApiError && err.status === 404) {
            return agentVoice.collectionMissing
          }
          return agentVoice.backendDown
        },
        (state) =>
          syncMessage(agentMessageId, {
            content: state.content,
            sources: state.sources,
            error: state.error,
          }),
      )
      setPending(false)
    },
    [threadId, collectionId, pending, messageCount, addMessage, syncMessage, touchThread],
  )

  return { send, pending }
}
