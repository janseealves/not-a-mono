import { useState } from 'react'

interface ComposerProps {
  disabled: boolean
  onSubmit: (query: string) => void
}

export function Composer({ disabled, onSubmit }: ComposerProps) {
  const [value, setValue] = useState('')

  const submit = () => {
    const query = value.trim()
    if (!query || disabled) return
    onSubmit(query)
    setValue('')
  }

  return (
    <form
      className="flex items-end gap-3 border-t border-hair px-8 py-5"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <span className="select-none pb-2 font-display text-sm text-amber">&gt;</span>
      <textarea
        rows={1}
        value={value}
        disabled={disabled}
        placeholder="pergunte ao mono…"
        className="max-h-40 flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-bone placeholder:text-slate/60 focus:outline-none disabled:opacity-50"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          // Enter envia; Shift+Enter quebra linha
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-[3px] bg-amber px-4 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-ground transition-colors hover:bg-ember disabled:cursor-not-allowed disabled:opacity-30"
      >
        enviar
      </button>
    </form>
  )
}
