import { useReducer, useState } from 'react'

import { ApiError } from '../api/client'
import { ChatPanel } from '../components/chat/ChatPanel'
import { InspectorPanel } from '../components/inspector/InspectorPanel'
import { type AskResult, useAsk } from '../hooks/useAsk'
import { useHealth } from '../hooks/useHealth'
import { useSources } from '../hooks/useSources'
import { conversationReducer, messageId } from '../state/conversation'
import { monoLatency, monoVoice } from '../voice/mono'

export function RagPage() {
  const [messages, dispatch] = useReducer(conversationReducer, [])
  const [topK, setTopK] = useState(5)
  const [lastRun, setLastRun] = useState<AskResult | null>(null)
  const { online } = useHealth()
  const { sources, addSource } = useSources()
  const askMutation = useAsk()

  const handleAsk = (query: string) => {
    dispatch({ type: 'push', message: { id: messageId(), role: 'user', text: query } })
    askMutation.mutate(
      { query, topK },
      {
        onSuccess: (result) => {
          setLastRun(result)
          dispatch({
            type: 'push',
            message: {
              id: messageId(),
              role: 'mono',
              text: result.answer,
              meta: monoLatency(result.latencyMs, result.topK),
            },
          })
        },
        onError: (error) => {
          const offline = error instanceof ApiError && error.isOffline
          dispatch({
            type: 'push',
            message: {
              id: messageId(),
              role: 'mono',
              text: offline ? monoVoice.backendDown : monoVoice.askFailed,
              error: true,
            },
          })
        },
      },
    )
  }

  return (
    <div className="flex h-full">
      <ChatPanel
        messages={messages}
        thinking={askMutation.isPending}
        hasSources={sources.length > 0}
        onAsk={handleAsk}
      />
      <InspectorPanel
        lastRun={lastRun}
        topK={topK}
        onTopKChange={setTopK}
        sources={sources}
        online={online}
        onIngested={addSource}
      />
    </div>
  )
}
