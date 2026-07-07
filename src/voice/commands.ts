// Comandos locais do chat — reconhecidos no RagPage e destacados no texto
// pelo CommandText. Adicionar um comando novo aqui já cobre o highlight;
// o dispatch (o que ele faz) continua vivendo em RagPage.handleAsk.
export const CHAT_COMMANDS = ['/help'] as const
export type ChatCommand = (typeof CHAT_COMMANDS)[number]
