import type { Collection } from '../types/collections'
import { get, post } from './client'

export const createCollection = (name: string, description?: string) =>
  post<Collection>('/v1/rag/collections', { name, description })

export const listCollections = () => get<Collection[]>('/v1/rag/collections')
