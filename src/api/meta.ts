import type { HealthResponse } from '../types/meta'
import { get } from './client'

export const getHealth = () => get<HealthResponse>('/health')
