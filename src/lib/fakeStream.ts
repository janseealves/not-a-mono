// "Encena" um texto estático como se fosse um stream de tokens — usado pelas
// mensagens padrão do mono (ex.: collection vazia) manterem a mesma cadência
// de digitação de uma resposta real, sem chamar o backend.
export async function* fakeStream(text: string, delayMs = 30): AsyncGenerator<string> {
  const words = text.split(' ')
  for (let i = 0; i < words.length; i++) {
    yield i === 0 ? words[i] : ` ${words[i]}`
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
}
