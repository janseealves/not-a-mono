import type { Collection } from '../types/rag'
import { post } from './client'

export const createCollection = (name: string, description?: string) =>
  post<Collection>('/v1/rag/collections', { name, description })
