// A voz do MONO — seco, preciso, levemente afiado.
// Defaults do brandbook: humor 60 · franqueza 90 · verbosidade 25.

export const monoVoice = {
  emptyChat: 'Pergunte. Eu recupero, raciocino e respondo — nessa ordem.',
  emptyIndex: 'Índice vazio. Ingira alguma coisa primeiro — eu não invento fontes.',
  backendDown: 'Sem resposta do back-end. Ou caiu, ou está fingindo que não me conhece.',
  askFailed: 'Não consegui responder. O back-end engasgou no meio do raciocínio.',
  searchFailed: 'A resposta saiu, mas o detalhe da recuperação não. O search falhou — siga sem ele.',
  noChunks: 'Nada recuperado. Ou o índice está vazio, ou a pergunta não toca em nada que eu conheça.',
  ingestError: 'Essa URL não entrou. Verifique se é um endereço de verdade.',
  ingestOffline: 'Não dá pra indexar com o back-end fora do ar. Óbvio, eu sei.',
  sourcesEphemeral:
    'Fontes desta sessão. Se o back-end reiniciar, o índice em memória esquece tudo.',
  offlineWarning: 'Back-end fora do ar. O índice em memória provavelmente já era.',
  inspectorIdle: 'Nada inspecionado ainda. Faça uma pergunta e eu mostro o que recuperei.',
} as const

export const monoLatency = (ms: number, k: number): string =>
  `${(ms / 1000).toFixed(2)}s · top ${k}`

// Rótulo do estado do slab, igual ao brandbook
export const slabLabel = (t: number): string => {
  if (t < 0.04) return 'monolito'
  if (t < 0.35) return 'fendendo'
  if (t < 0.8) return 'articulando'
  return 'articulado'
}
