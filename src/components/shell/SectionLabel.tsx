// Rótulo de seção no padrão do brandbook: uppercase, tracking largo, ponto âmbar.
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-slate">
      <span className="text-amber">·</span> {children}
    </div>
  )
}
