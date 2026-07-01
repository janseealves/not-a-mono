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
      className="flex items-end gap-2 rounded-2xl border border-hair bg-surface px-3 py-2.5 shadow-sm shadow-black/5 transition-colors focus-within:border-slate/40"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <textarea
        rows={1}
        value={value}
        disabled={disabled}
        placeholder="pergunte ao mono…"
        className="max-h-40 flex-1 resize-none self-center bg-transparent px-1 py-1.5 text-sm leading-relaxed text-bone placeholder:text-slate/60 focus:outline-none disabled:opacity-50"
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
        aria-label="enviar"
        disabled={disabled || !value.trim()}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber text-ground transition-colors hover:bg-ember disabled:cursor-not-allowed disabled:opacity-25"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 19V5M12 5l-6 6M12 5l6 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  )
}
