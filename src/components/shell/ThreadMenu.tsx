import { useRef, useState } from 'react'

import { useClickOutside } from '../../hooks/useClickOutside'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Panel } from '../ui/Panel'

interface ThreadMenuProps {
  title: string
  onRename: (title: string) => void
  onDelete: () => void
}

// Menu de contexto por thread na sidebar. Fica dentro do <Link> do item da
// thread, então todo clique aqui precisa parar de propagar pra não disparar
// a navegação do Link.
export function ThreadMenu({ title, onRename, onDelete }: ThreadMenuProps) {
  const [open, setOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [value, setValue] = useState(title)
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(
    containerRef,
    () => {
      setOpen(false)
      setRenaming(false)
    },
    open,
  )

  const commitRename = () => {
    const next = value.trim()
    if (next) onRename(next)
    setOpen(false)
    setRenaming(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      // stopPropagation não basta: sem preventDefault, o clique ainda dispara
      // a navegação nativa do <a> do Link ancestor (o handler do Link, que
      // faria o preventDefault, nunca chega a rodar porque a propagação já
      // foi cortada antes de alcançá-lo).
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <button
        type="button"
        aria-label="opções da conversa"
        data-active={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-6 w-6 shrink-0 place-items-center rounded-[2px] text-slate transition-colors hover:text-bone data-[active=true]:text-amber"
      >
        ⋯
      </button>

      {open && (
        <Panel className="absolute right-0 top-full z-30 mt-1 w-48 p-1.5 shadow-lg shadow-black/10">
          {renaming ? (
            <form
              className="flex flex-col gap-1.5 p-1"
              onSubmit={(e) => {
                e.preventDefault()
                commitRename()
              }}
            >
              <Input autoFocus value={value} onChange={(e) => setValue(e.target.value)} />
              {/* type="button", não "submit": um submit aqui dispararia o
                  preventDefault do container (que bloqueia a navegação do
                  Link) ANTES do evento 'submit' rodar — cancelando os dois
                  default actions da mesma vez, e o form nunca commitaria. */}
              <Button type="button" variant="secondary" onClick={commitRename}>
                salvar
              </Button>
            </form>
          ) : (
            <div className="flex flex-col">
              <button
                type="button"
                className="rounded-[2px] px-2.5 py-1.5 text-left text-[12px] text-bone hover:bg-ground"
                onClick={() => setRenaming(true)}
              >
                renomear
              </button>
              <button
                type="button"
                className="rounded-[2px] px-2.5 py-1.5 text-left text-[12px] text-ember hover:bg-ground"
                onClick={() => {
                  onDelete()
                  setOpen(false)
                }}
              >
                apagar
              </button>
            </div>
          )}
        </Panel>
      )}
    </div>
  )
}
