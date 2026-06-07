// Conversa em memória — o backend não tem histórico; recarregar limpa.

export type Role = 'user' | 'mono'

export interface Message {
  id: string
  role: Role
  text: string
  /** linha de readout abaixo da mensagem (latência, top_k) */
  meta?: string
  error?: boolean
}

export type ConversationAction = { type: 'push'; message: Message }

export function conversationReducer(
  state: Message[],
  action: ConversationAction,
): Message[] {
  switch (action.type) {
    case 'push':
      return [...state, action.message]
  }
}

export const messageId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random())
