import { type AgentMessage, mergeSources, readMessages, readThreads, writeMessages } from './agentStorage'
import type { AgentStreamEvent } from '../types/agent'

export interface StreamState {
  content: string
  sources?: AgentMessage['sources']
  done: boolean
  error?: boolean
}

type Listener = (state: StreamState) => void

interface Entry {
  messageId: string
  state: StreamState
  listeners: Set<Listener>
}

// Streams em andamento, por thread — vive fora de qualquer componente React,
// então trocar de thread na sidebar (ou desmontar a página) não interrompe
// uma resposta que ainda está chegando.
const active = new Map<string, Entry>()

export function getActiveStream(threadId: string): { messageId: string; state: StreamState } | undefined {
  const entry = active.get(threadId)
  return entry ? { messageId: entry.messageId, state: entry.state } : undefined
}

// Inscreve-se nas atualizações de uma thread com stream em andamento. Chama o
// listener imediatamente com o estado atual, se houver um. Não-op (cleanup
// vazio) se não há stream ativo pra essa thread.
export function subscribeToStream(threadId: string, listener: Listener): () => void {
  const entry = active.get(threadId)
  if (!entry) return () => {}
  entry.listeners.add(listener)
  listener(entry.state)
  return () => entry.listeners.delete(listener)
}

function notify(threadId: string): void {
  const entry = active.get(threadId)
  if (!entry) return
  for (const listener of entry.listeners) listener(entry.state)
}

// A thread pode ter sido apagada enquanto a resposta ainda chegava — descarta
// o commit em vez de "ressuscitar" uma chave de mensagens já removida.
function patchMessage(threadId: string, messageId: string, patch: Partial<AgentMessage>): void {
  if (!readThreads().some((t) => t.id === threadId)) return
  writeMessages(
    threadId,
    readMessages(threadId).map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
  )
}

// Consome o SSE de uma resposta do agente. Tokens só atualizam o buffer em
// memória (notificados aos listeners); a escrita em localStorage só acontece
// nos checkpoints (evento de fontes, fim do stream, erro) — persistir a cada
// token faria um JSON.stringify do array inteiro de mensagens por chunk.
export async function runAgentStream(
  threadId: string,
  messageId: string,
  events: AsyncGenerator<AgentStreamEvent>,
  // Recebe o erro bruto (ex.: ApiError com status) pra que o chamador escolha
  // o texto certo — um 404 de collection_id órfão é uma mensagem diferente de
  // um backend fora do ar.
  resolveErrorText: (err: unknown) => string,
  // Inscrito atomicamente antes de qualquer evento ser consumido — evita a
  // corrida de assinar depois que o primeiro token já teria chegado.
  onUpdate?: Listener,
): Promise<void> {
  const state: StreamState = { content: '', done: false }
  active.set(threadId, { messageId, state, listeners: new Set(onUpdate ? [onUpdate] : []) })

  try {
    for await (const event of events) {
      if (event.type === 'token') {
        state.content += event.content
      } else {
        state.sources = mergeSources(state.sources, event.sources)
        patchMessage(threadId, messageId, { sources: state.sources })
      }
      notify(threadId)
    }
    patchMessage(threadId, messageId, { content: state.content, sources: state.sources })
  } catch (err) {
    state.error = true
    patchMessage(threadId, messageId, { content: state.content || resolveErrorText(err), error: true })
  } finally {
    state.done = true
    notify(threadId)
    active.delete(threadId)
  }
}
