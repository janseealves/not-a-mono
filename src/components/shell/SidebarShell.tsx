import { type ReactNode, useState } from 'react'

import { MobileDrawerContext, useMobileDrawer } from '../../hooks/useMobileDrawer'
import { cx } from '../ui/cx'

export function MobileDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <MobileDrawerContext.Provider value={{ open, setOpen }}>{children}</MobileDrawerContext.Provider>
}

// Trilho de ícones que expande no hover — só desktop, com estado PRÓPRIO,
// local (não compartilhado com o drawer mobile). Hover (contínuo, só mouse) e
// toque (discreto, clique) já dividiram um `open` só antes, e o hover do
// trilho acabava "abrindo" o drawer mobile sozinho sempre que o cursor ficava
// sobre a área do trilho antes do viewport encolher pra mobile.
export function DesktopSidebarRail({ children }: { children: (expanded: boolean) => ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cx(
        // bg-surface sólido, sem backdrop-blur: em combinação com
        // position:fixed (o drawer mobile compartilha esse tipo de contexto),
        // backdrop-filter tem comportamento inconsistente entre engines
        // (reproduzido no Firefox desktop) — prioriza funcionar sempre.
        'hidden h-full shrink-0 flex-col overflow-hidden border-r border-hair bg-surface transition-[width] duration-300 ease-in-out md:flex',
        expanded ? 'w-64' : 'w-[60px]',
      )}
      // style inline, não classe Tailwind: a classe rounded-r-lg não estava
      // sendo gerada de forma confiável pelo JIT (verificado direto no CSS
      // servido) — style inline nunca depende de scan/geração, sempre aplica.
      style={{ borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}
    >
      {children(expanded)}
    </aside>
  )
}

// Drawer de tela cheia no mobile — sem topbar própria; quem abre é o
// SidebarMenuButton, embutido no header da página (ver AgentPage). `children`
// aqui é sempre renderizado "expandido" (rótulos visíveis) — não há conceito
// de hover no toque, então não faz sentido colapsar.
//
// Sempre montado (nunca `{open && ...}`): pra animar com CSS transition puro
// (sem lib) é preciso o elemento existir nos dois estados — o que muda é a
// classe. `open` controla um slide-in do painel + fade do fundo escurecido;
// fechado, some via opacity/inert, não unmount.
export function MobileSidebarDrawer({ children }: { children: ReactNode }) {
  const { open, setOpen } = useMobileDrawer()

  return (
    // Sem backdrop-blur aqui: backdrop-filter num elemento fixed de tela
    // cheia deu artefato de compositing reproduzido tanto em mobile quanto
    // no Firefox desktop (o conteúdo de trás "vazava" em faixas quebradas).
    // Fundo sólido é o preço de funcionar de verdade em qualquer navegador.
    <div
      // inert (não só pointer-events-none): fechado, tira o painel também da
      // navegação por teclado/leitor de tela — não só do clique.
      inert={!open}
      className={cx(
        'fixed inset-0 z-[100] flex transition-opacity duration-300 ease-in-out md:hidden',
        open ? 'opacity-100' : 'opacity-0',
      )}
    >
      {/* 80% da largura, não 100%: a fatia visível do chat por trás (com a
          área escurecida por cima) é a dica visual de que basta tocar fora
          pra fechar — um drawer full-bleed não deixa isso óbvio.
          O slide usa `left`, não `transform:translateX` — border-radius +
          overflow:hidden + transform no MESMO elemento é um bug conhecido de
          compositing no WebKit (a camada composta ignora o recorte
          arredondado). `left` anima fora do compositor, sem esse problema. */}
      <div
        className="absolute inset-y-0 flex h-full w-4/5 max-w-[300px] flex-col overflow-hidden bg-surface transition-[left] duration-300 ease-in-out"
        style={{
          left: open ? '0' : '-100%',
          borderTopRightRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
        }}
      >
        <div className="flex flex-1 flex-col overflow-hidden" onClick={() => setOpen(false)}>
          {children}
        </div>
      </div>
      <button
        type="button"
        aria-label="fechar menu"
        onClick={() => setOpen(false)}
        className="flex-1 bg-bone/20"
      />
    </div>
  )
}

interface SidebarMenuButtonProps {
  className?: string
}

// Botão de hambúrguer — só mobile (o desktop expande no hover do trilho, não
// tem botão). Pensado pra viver dentro do header da página (ao lado do
// título), não numa faixa própria acima dele.
export function SidebarMenuButton({ className }: SidebarMenuButtonProps) {
  const { setOpen } = useMobileDrawer()
  return (
    <button
      type="button"
      aria-label="abrir menu"
      onClick={() => setOpen(true)}
      className={cx('grid h-8 w-8 shrink-0 place-items-center text-slate hover:text-bone md:hidden', className)}
    >
      <MenuIcon />
    </button>
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
