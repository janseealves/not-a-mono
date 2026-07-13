// Rótulo do estado do slab: monolito em repouso → dobra nas juntas → articulado
export const slabLabel = (t: number): string => {
  if (t < 0.04) return 'monolito'
  if (t < 0.35) return 'dobrando'
  if (t < 0.8) return 'articulando'
  return 'articulado'
}
