// A voz do agente nesta demo pública — mesma seca/precisa de voice/mono.ts.
// A collection (useCollection) é toda automática, uma por navegador — o
// visitante nunca escolhe nem cria, então a busca nunca é mencionada aqui.

export const agentVoice = {
  welcome: 'Converso com memória — cada thread guarda o fio da conversa, isolado das outras.',
  helpHint: 'primeira vez? digite /help.',
  help: [
    'Isto é uma demo pública, sem login — a conversa fica salva só no seu navegador.',
    '',
    '1. "novo chat" (sidebar) — abre uma thread nova, isolada das outras.',
    '2. recarregar a página não perde a conversa — ela vive no localStorage deste navegador.',
  ].join('\n'),
  backendDown: 'Não consegui responder. O back-end engasgou no meio do raciocínio.',
  collectionMissing: 'Não consegui responder — o índice desta sessão sumiu. Tente de novo.',
} as const
