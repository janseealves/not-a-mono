// Espelha interfaces/api/schemas/collection.py

export interface Collection {
  id: string // external_id (uuid) — é o que entra na URL
  name: string
  description: string | null
  created_at: string
}
