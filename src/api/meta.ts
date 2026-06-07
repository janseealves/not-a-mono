import type { HealthResponse } from '../types/rag'
import { get } from './client'

export const getHealth = () => get<HealthResponse>('/health')
