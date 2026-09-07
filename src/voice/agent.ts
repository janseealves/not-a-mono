// A voz do agente nesta demo pública — mesma seca/precisa de voice/mono.ts.
// A base é fixa e única (lib/collection.ts): o currículo. O visitante não
// escolhe nem cria nada, então o que precisa ficar claro é o ESCOPO — sobre o
// que dá pra perguntar, e que a resposta sai de um documento, não do modelo.

export const agentVoice = {
  welcome:
    'Converso sobre um documento só: o currículo do Jansen Alves Raimundo.\n' +
    'Pergunte sobre experiência, projetos, stack ou formação — a resposta sai do PDF indexado, com o trecho usado junto.',
  helpHint: 'primeira vez? digite /help.',
  basis: 'base: currículo de Jansen Alves Raimundo — respostas fora dele o agente não inventa',
  help: [
    'Demo pública de RAG, sem login. A base de conhecimento é um documento só: o currículo do Jansen Alves Raimundo.',
    '',
    '1. pergunte em português — "onde ele trabalhou?", "ele usa AWS?", "quando se forma?"',
    '2. a resposta vem do PDF indexado; se a informação não estiver lá, o agente diz que não sabe em vez de chutar.',
    '3. abra as referências abaixo de cada resposta pra ver de quantos trechos ela saiu.',
    '4. "novo chat" (sidebar) — abre uma thread nova, isolada das outras.',
    '5. recarregar a página não perde a conversa — ela vive no localStorage deste navegador.',
  ].join('\n'),
  backendDown: 'Não consegui responder. O back-end engasgou no meio do raciocínio.',
  collectionMissing: 'Não consegui responder — a base do currículo não está acessível agora.',
} as const
