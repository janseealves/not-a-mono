// A demo conversa com UMA collection: o currículo indexado no backend.
//
// Não é segredo — é o id público de uma base que qualquer visitante consulta —
// então pode entrar no bundle com o prefixo VITE_. Fica em env var, e não
// hardcoded, porque dev e produção indexam o currículo em bancos diferentes e
// portanto em ids diferentes.
//
// Ausente, o chat ainda responde: a rota de chat aceita collection_id nulo e o
// agente conversa sem base nenhuma. Como isso é degradação silenciosa — parece
// funcionar, só que sem currículo — o aviso no console existe para a falha de
// configuração não passar despercebida.
const configured: string | undefined = import.meta.env.VITE_COLLECTION_ID

if (!configured) {
  console.warn('VITE_COLLECTION_ID ausente — o agente vai responder sem acesso ao currículo.')
}

export const COLLECTION_ID: string | null = configured ?? null
