// Comandos locais do chat — reconhecidos no AgentPage e destacados no texto
// pelo CommandText. Adicionar um comando novo aqui já cobre o highlight;
// o dispatch (o que ele faz) continua vivendo em AgentPage.handleSubmit.
export const CHAT_COMMANDS = ['/help'] as const
export type ChatCommand = (typeof CHAT_COMMANDS)[number]
