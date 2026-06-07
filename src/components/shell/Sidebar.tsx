import { MonoBadge } from '../mono/MonoBadge'
import { HealthIndicator } from './HealthIndicator'
import { ModuleNav } from './ModuleNav'
import { Wordmark } from './Wordmark'

export function Sidebar() {
  return (
    <aside className="flex w-[228px] shrink-0 flex-col border-r border-hair bg-ground px-5 py-6">
      <div className="mb-10 flex items-center gap-3">
        <MonoBadge size={34} />
        <div className="flex flex-col gap-0.5">
          <Wordmark />
          <span className="text-[9px] uppercase tracking-[0.22em] text-slate">
            not<span className="text-amber">-</span>a
            <span className="text-amber">-</span>monolith
          </span>
        </div>
      </div>

      <ModuleNav />

      <div className="mt-auto">
        <HealthIndicator />
      </div>
    </aside>
  )
}
