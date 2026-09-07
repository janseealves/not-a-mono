// A voz do agente nesta demo pública. Diais do brandbook: humor 60,
// franqueza 90, verbosidade 25 — o teto de verbosidade é o que dita o
// tamanho daqui. Frase curta, ponto final, sem parágrafo de boas-vindas.
//
// A base é fixa (lib/collection.ts) e o visitante não escolhe nem cria nada,
// então basta nomear o assunto — nada de explicar a arquitetura do RAG pra
// quem só quer perguntar. Cada superfície diz uma coisa, sem repetir a outra:
//   welcome — o assunto e onde ele acaba (tela vazia, some na 1ª pergunta)
//   help    — só a mecânica que não cabe no welcome
export const agentVoice = {
  welcome:
    'Aqui você conversa com o currículo do Jansen Alves Raimundo.\n' +
    'Experiência, stack, projetos, formação. O que não estiver lá, eu digo que não sei.',
  helpHint: 'nunca conversou com um currículo? /help',
  help: [
    'Demo de RAG. Sem login, sem cadastro, sem newsletter.',
    '',
    '1. pergunte em português — "onde ele trabalhou?", "ele usa AWS?", "quando se forma?"',
    '2. abaixo de cada resposta ficam os trechos que a sustentam. desconfie à vontade.',
    '3. "novo chat" na sidebar — thread limpa, sem contaminar as outras.',
    '4. recarregar não perde nada: a conversa mora no localStorage deste navegador.',
  ].join('\n'),
  backendDown: 'Não consegui responder. O back-end engasgou no meio do raciocínio.',
  collectionMissing: 'Não consegui responder — a base do currículo não está acessível agora.',
} as const
