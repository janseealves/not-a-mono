import { useRef, useState } from 'react'

import { useClickOutside } from '../../hooks/useClickOutside'
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
// Fica fora do caminho até você precisar — como um menu do claude.ai. Vive no
// header do AgentPage (ao lado do HealthDot), já que a collection é global
// por navegador, não por thread.
export function SourcesControl({ collectionId, sources, online, onIngested }: SourcesControlProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, () => setOpen(false), open)

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
