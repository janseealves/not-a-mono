import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { cx } from '../ui/cx'

interface MarkdownProps {
  children: string
  /** durante o streaming, o último bloco fica inline pro cursor colar no texto */
  streaming?: boolean
  className?: string
}

// Só a fala do agente passa por aqui. Mensagem do usuário continua texto puro:
// renderizar markdown do que o próprio visitante digitou mudaria o que ele
// escreveu, e não há por que dar a ele controle sobre a marcação da tela.
//
// react-markdown não interpreta HTML embutido sem o rehype-raw, então tag que
// venha no texto do modelo aparece escapada em vez de virar elemento.
export function Markdown({ children, streaming, className }: MarkdownProps) {
  return (
    <div className={cx('mono-md', streaming && 'mono-md--streaming', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}
