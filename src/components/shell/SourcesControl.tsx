import { useEffect, useRef, useState } from 'react'

import { IngestPanel } from '../inspector/IngestPanel'
import { SourceList } from '../inspector/SourceList'
import { Button } from '../ui/Button'
import { Label } from '../ui/Label'
import { Panel } from '../ui/Panel'

interface SourcesControlProps {
  collectionId: string | null
  sources: string[]
  online: boolean
  onIngested: (url: string) => void
}

// Tudo que era o inspector cabe aqui: ingerir fontes, ver o índice. Top_k é
// interno — não é algo que o usuário deva calibrar.
// Fica fora do caminho até você precisar — como um menu do claude.ai.
export function SourcesControl({
  collectionId,
  sources,
  online,
  onIngested,
}: SourcesControlProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fecha em qualquer clique fora — inclusive na área do chat. Um overlay
  // fixed inset-0 não serve aqui: o header tem backdrop-blur, que cria um
  // containing block e prende um filho fixed ao tamanho da barra, não da tela.
  useEffect(() => {
    if (!open) return

    const handlePointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <Button type="button" variant="ghost" active={open} onClick={() => setOpen((v) => !v)}>
        fontes
        <span className="font-medium tabular-nums">{sources.length}</span>
      </Button>

      {open && (
        <Panel className="absolute right-0 top-full z-30 mt-2 flex w-[280px] flex-col gap-5 p-4 shadow-lg shadow-black/5">
          <div className="flex flex-col gap-2">
            <Label>indexar url</Label>
            <IngestPanel collectionId={collectionId} onIngested={onIngested} />
          </div>

          {sources.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-hair pt-4">
              <Label>índice · {sources.length}</Label>
              <SourceList sources={sources} online={online} />
            </div>
          )}
        </Panel>
      )}
    </div>
  )
}
