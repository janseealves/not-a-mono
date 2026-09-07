import type { SourceInfo } from '../types/agent'

const THREADS_KEY = 'mono-ui:agent:threads'
const ACTIVE_THREAD_KEY = 'mono-ui:agent:active-thread'
const NEXT_THREAD_NUMBER_KEY = 'mono-ui:agent:next-thread-number'
const messagesKey = (threadId: string) => `mono-ui:agent:messages:${threadId}`

export interface Thread {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface AgentMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  sources?: SourceInfo[]
  createdAt: string
  error?: boolean
}

export function readThreads(): Thread[] {
  try {
    return JSON.parse(localStorage.getItem(THREADS_KEY) ?? '[]') as Thread[]
  } catch {
    return []
  }
}

export function writeThreads(threads: Thread[]): void {
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads))
}

export function readMessages(threadId: string): AgentMessage[] {
  try {
    return JSON.parse(localStorage.getItem(messagesKey(threadId)) ?? '[]') as AgentMessage[]
  } catch {
    return []
  }
}

export function writeMessages(threadId: string, messages: AgentMessage[]): void {
  localStorage.setItem(messagesKey(threadId), JSON.stringify(messages))
}

// Remove a thread da lista e sua chave de mensagens — nunca deixa a chave
// órfã (senão um id reaproveitado "ressuscitaria" uma conversa apagada).
export function deleteThreadStorage(threadId: string): void {
  writeThreads(readThreads().filter((t) => t.id !== threadId))
  localStorage.removeItem(messagesKey(threadId))
}

export function readActiveThreadId(): string | null {
  return localStorage.getItem(ACTIVE_THREAD_KEY)
}

export function writeActiveThreadId(id: string): void {
  localStorage.setItem(ACTIVE_THREAD_KEY, id)
}

// Título de uma thread nova, antes da 1ª mensagem definir o real (deriveTitle).
// Contador persistente — nunca reusa número, mesmo depois de apagar threads.
export function nextThreadTitle(): string {
  const current = Number(localStorage.getItem(NEXT_THREAD_NUMBER_KEY) ?? '1')
  localStorage.setItem(NEXT_THREAD_NUMBER_KEY, String(current + 1))
  return `unidade-${String(current).padStart(3, '0')}`
}

export function deriveTitle(firstUserMessage: string, max = 44): string {
  const trimmed = firstUserMessage.trim().replace(/\s+/g, ' ')
  return trimmed.length > max ? `${trimmed.slice(0, max).trimEnd()}…` : trimmed
}

// O agente pode chamar a tool de busca mais de uma vez na mesma resposta —
// acumula por documento em vez de sobrescrever a cada evento 'sources'.
export function mergeSources(
  prev: SourceInfo[] | undefined,
  incoming: SourceInfo[],
): SourceInfo[] {
  const bySource = new Map<string, { title?: string; chunkIds: Set<string> }>()
  for (const s of [...(prev ?? []), ...incoming]) {
    const entry = bySource.get(s.source)
    if (!entry) {
      bySource.set(s.source, { title: s.title, chunkIds: new Set(s.chunk_ids) })
      continue
    }
    // Uma resposta retomada do localStorage pode não ter título; se um evento
    // novo trouxer um para o mesmo documento, aproveita.
    entry.title ??= s.title
    for (const id of s.chunk_ids) entry.chunkIds.add(id)
  }
  return [...bySource.entries()].map(([source, { title, chunkIds }]) => ({
    source,
    title,
    chunk_ids: [...chunkIds],
  }))
}
