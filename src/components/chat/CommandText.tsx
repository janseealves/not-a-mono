import { CHAT_COMMANDS } from '../../voice/commands'

const pattern = new RegExp(`(${CHAT_COMMANDS.join('|').replace(/\//g, '\\/')})`, 'g')

interface CommandTextProps {
  text: string
}

// Destaca /comandos conhecidos dentro de um texto — vocabulário fechado em
// CHAT_COMMANDS, não markdown genérico, então uma URL com "//" não vira chip.
export function CommandText({ text }: CommandTextProps) {
  return text
    .split(pattern)
    .map((part, i) =>
      (CHAT_COMMANDS as readonly string[]).includes(part) ? (
        <code key={i} className="normal-case text-amber">
          {part}
        </code>
      ) : (
        part
      ),
    )
}
