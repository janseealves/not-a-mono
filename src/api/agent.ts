import type { AgentStreamEvent, ChatRequest, SourceInfo } from '../types/agent'
import { sseFrames } from './client'

export async function* streamChat(request: ChatRequest): AsyncGenerator<AgentStreamEvent> {
  for await (const frame of sseFrames('/v1/agent/chat', request)) {
    yield frame.event === 'sources'
      ? { type: 'sources', sources: frame.data as SourceInfo[] }
      : { type: 'token', content: (frame.data as { content: string }).content }
  }
}
