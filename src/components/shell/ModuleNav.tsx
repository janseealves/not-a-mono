import { NavLink } from 'react-router-dom'

import { SectionLabel } from './SectionLabel'

interface Module {
  slug: string
  name: string
  active: boolean
}

// Espelha modules/ do not-a-monolith — novos módulos do backend entram aqui.
const MODULES: Module[] = [
  { slug: 'rag', name: 'rag', active: true },
]

export function ModuleNav() {
  return (
    <nav className="flex flex-col gap-1">
      <div className="mb-3">
        <SectionLabel>módulos</SectionLabel>
      </div>
      {MODULES.map((mod) =>
        mod.active ? (
          <NavLink
            key={mod.slug}
            to={`/${mod.slug}`}
            className={({ isActive }) =>
              `group flex items-center justify-between border-l-2 px-3 py-2 font-display text-[13px] lowercase transition-colors ${
                isActive
                  ? 'border-amber bg-surface text-bone'
                  : 'border-transparent text-slate hover:border-steel hover:text-bone'
              }`
            }
          >
            {mod.name}
            <span className="text-[10px] text-amber opacity-0 transition-opacity group-[.active]:opacity-100">
              ▸
            </span>
          </NavLink>
        ) : (
          <div
            key={mod.slug}
            className="flex cursor-not-allowed items-center justify-between border-l-2 border-transparent px-3 py-2 font-display text-[13px] lowercase text-slate/50"
            title="módulo ainda não existe no backend"
          >
            {mod.name}
            <span className="text-[9px] uppercase tracking-[0.18em] text-slate/40">
              em breve
            </span>
          </div>
        ),
      )}
    </nav>
  )
}
