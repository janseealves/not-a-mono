import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'

import type { Thread } from '../../lib/agentStorage'
import { MonoBadge } from '../mono/MonoBadge'
import { cx } from '../ui/cx'
import { ThreadMenu } from './ThreadMenu'
import { Wordmark } from './Wordmark'

interface SidebarProps {
  // Explícito, não lido de contexto: o trilho desktop (hover) e o drawer
  // mobile (clique) têm estados de abertura independentes — cada instância
  // de <Sidebar> recebe o `expanded` que faz sentido pra moldura em que está.
  expanded: boolean
  threads: Thread[]
  onCreateThread: () => void
  onRenameThread: (id: string, title: string) => void
  onDeleteThread: (id: string) => void
}

// Conteúdo puro da sidebar — quem decide a moldura (trilho desktop vs. drawer
// mobile) é o AppShell, renderizando isto dentro de DesktopSidebarRail e de
// MobileSidebarDrawer (duas instâncias independentes, uma por breakpoint).
export function Sidebar({ expanded, threads, onCreateThread, onRenameThread, onDeleteThread }: SidebarProps) {
  const { threadId: activeThreadId } = useParams()

  return (
    <>
      <div className="flex items-center px-3 py-4">
        <IconSlot>
          <MonoBadge size={22} />
        </IconSlot>
        <SidebarLabel expanded={expanded}>
          <Wordmark />
        </SidebarLabel>
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={onCreateThread}
          className="flex w-full items-center rounded-[2px] text-slate transition-colors hover:bg-ground hover:text-bone"
        >
          <IconSlot>
            <span className="text-base leading-none">+</span>
          </IconSlot>
          <SidebarLabel expanded={expanded} className="flex-1 text-left text-[13px]">
            novo chat
          </SidebarLabel>
        </button>
      </div>

      <nav className="mt-3 flex-1 overflow-y-auto px-3 pb-3 [scrollbar-gutter:stable]">
        {threads.map((thread) => {
          const isActive = thread.id === activeThreadId
          return (
            <Link
              key={thread.id}
              to={`/demo/${thread.id}`}
              className={cx(
                // sem overflow-hidden aqui: cortaria o dropdown do ThreadMenu
                // (position:absolute, "escapa" da linha). SidebarLabel já se
                // recorta por conta própria.
                'mb-0.5 flex items-center rounded-[2px] py-2 pr-2 text-[13px] transition-colors',
                isActive ? 'bg-ground text-bone' : 'text-slate hover:bg-ground hover:text-bone',
              )}
            >
              <IconSlot>
                <span
                  className={cx(
                    'grid h-6 w-6 place-items-center rounded-full border text-[10px] uppercase',
                    isActive ? 'border-amber text-amber' : 'border-hair text-slate',
                  )}
                >
                  {thread.title.trim().charAt(0) || '?'}
                </span>
              </IconSlot>
              <SidebarLabel expanded={expanded} className="min-w-0 flex-1 truncate">
                {thread.title}
              </SidebarLabel>
              {/* só ocupa espaço expandida — no trilho colapsado de 60px não
                  há lugar pro botão "⋯" ao lado do avatar. */}
              {expanded && (
                <ThreadMenu
                  title={thread.title}
                  onRename={(title) => onRenameThread(thread.id, title)}
                  onDelete={() => onDeleteThread(thread.id)}
                />
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

// Coluna de ícone de largura fixa — marca, "novo chat" e avatar de thread
// usam o mesmo slot, então o ícone sempre cai na mesma posição horizontal,
// colapsado ou expandido, independente do tamanho real do conteúdo (o badge
// tem 22px, o avatar 24px, o "+" é só um caractere).
function IconSlot({ children }: { children: ReactNode }) {
  return <div className="grid h-9 w-9 shrink-0 place-items-center">{children}</div>
}

// Rótulo que só existe visualmente quando a sidebar está expandida (hover no
// trilho do desktop, ou drawer aberto no mobile) — largura e opacidade
// animadas via CSS, sem lib de animação.
function SidebarLabel({
  expanded,
  children,
  className,
}: {
  expanded: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cx(
        'overflow-hidden whitespace-nowrap transition-all duration-200',
        expanded ? 'ml-1 max-w-[170px] opacity-100' : 'ml-0 max-w-0 opacity-0',
        className,
      )}
    >
      {children}
    </span>
  )
}
