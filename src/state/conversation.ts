// Conversa em memória — o backend não tem histórico; recarregar limpa.

import type { AskResult } from '../hooks/useAsk'

export type Role = 'user' | 'mono'

export interface Message {
  id: string
  role: Role
  text: string
  /** linha de readout abaixo da mensagem (latência, top_k) */
  meta?: string
  error?: boolean
  /** recuperação por trás da resposta — abre no disclosure inline */
  run?: AskResult
}

export type ConversationAction =
  | { type: 'push'; message: Message }
  | { type: 'append'; id: string; text: string }
  | { type: 'patch'; id: string; patch: Partial<Message> }

export function conversationReducer(
  state: Message[],
  action: ConversationAction,
): Message[] {
  switch (action.type) {
    case 'push':
      return [...state, action.message]
    case 'append':
      return state.map((m) =>
        m.id === action.id ? { ...m, text: m.text + action.text } : m,
      )
    case 'patch':
      return state.map((m) => (m.id === action.id ? { ...m, ...action.patch } : m))
  }
}

export const messageId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random())
