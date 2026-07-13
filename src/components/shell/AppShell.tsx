import { Outlet, useNavigate } from 'react-router-dom'

import { useThreads } from '../../hooks/useThreads'
import { DesktopSidebarRail, MobileDrawerProvider, MobileSidebarDrawer } from './SidebarShell'
import { Sidebar } from './Sidebar'

// Duas colunas: sidebar de threads (trilho no desktop, drawer no mobile) +
// o módulo ativo no Outlet. useThreads vive aqui (não em AgentPage) e é
// passado via Outlet context — senão a sidebar e a página do agente teriam
// duas instâncias do hook fora de sincronia (ex.: o auto-título da 1ª
// mensagem não apareceria na sidebar sem remontar).
//
// MobileDrawerProvider também envolve o Outlet: o botão de hambúrguer vive
// dentro do header do AgentPage, não numa faixa própria — por isso a página
// precisa alcançar o mesmo contexto (useMobileDrawer) que o drawer usa. Note
// que isso é só sobre o drawer mobile — o hover do trilho desktop é estado
// local do próprio DesktopSidebarRail, não passa por aqui.
export function AppShell() {
  const navigate = useNavigate()
  const threadsApi = useThreads()

  const handleCreateThread = () => {
    const thread = threadsApi.createThread()
    threadsApi.setActiveThreadId(thread.id)
    navigate(`/demo/${thread.id}`)
  }

  const sidebarProps = {
    threads: threadsApi.threads,
    onCreateThread: handleCreateThread,
    onRenameThread: threadsApi.renameThread,
    onDeleteThread: threadsApi.deleteThread,
  }

  return (
    <MobileDrawerProvider>
      <div className="flex h-full">
        <DesktopSidebarRail>
          {(expanded) => <Sidebar expanded={expanded} {...sidebarProps} />}
        </DesktopSidebarRail>
        <MobileSidebarDrawer>
          <Sidebar expanded {...sidebarProps} />
        </MobileSidebarDrawer>
        <div className="min-h-0 min-w-0 flex-1">
          <Outlet context={threadsApi} />
        </div>
      </div>
    </MobileDrawerProvider>
  )
}

export type ThreadsApi = ReturnType<typeof useThreads>
