// A voz do agente nesta demo pública — mesma seca/precisa de voice/mono.ts.
// A collection (useCollection) é toda automática, uma por navegador — o
// visitante nunca escolhe nem cria uma, mas pode alimentá-la via "fontes".

export const agentVoice = {
  welcome: 'Converso com memória — cada thread guarda o fio da conversa, isolado das outras.',
  helpHint: 'primeira vez? digite /help.',
  help: [
    'Isto é uma demo pública, sem login — a conversa fica salva só no seu navegador.',
    '',
    '1. "novo chat" (sidebar) — abre uma thread nova, isolada das outras.',
    '2. "fontes" (canto superior direito) — indexa uma URL pra esta collection.',
    '3. recarregar a página não perde a conversa — ela vive no localStorage deste navegador.',
  ].join('\n'),
  backendDown: 'Não consegui responder. O back-end engasgou no meio do raciocínio.',
  collectionMissing: 'Não consegui responder — o índice desta sessão sumiu. Tente de novo.',
  ingestError: 'Essa URL não entrou. Verifique se é um endereço de verdade.',
  ingestOffline: 'Não dá pra indexar com o back-end fora do ar. Óbvio, eu sei.',
  sourcesEphemeral: 'Fontes indexadas nesta collection.',
  offlineWarning: 'Back-end fora do ar — não dá pra confirmar o que está indexado.',
} as const
