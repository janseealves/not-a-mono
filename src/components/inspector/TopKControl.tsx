interface TopKControlProps {
  value: number
  onChange: (k: number) => void
}

// Console do brandbook: readout k/v + trilho com thumb âmbar.
export function TopKControl({ value, onChange }: TopKControlProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
        <span className="text-slate">top_k</span>
        <span className="font-display font-medium text-amber">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={20}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-[9px] uppercase tracking-[0.16em] text-slate/60">
        <span>1</span>
        <span>20</span>
      </div>
    </div>
  )
}
