import { useRef, useState } from 'react'

import { Button } from '../ui/Button'
import { panelClass } from '../ui/Panel'
import { CommandText } from './CommandText'

interface ComposerProps {
  disabled: boolean
  onSubmit: (query: string) => void
}

export function Composer({ disabled, onSubmit }: ComposerProps) {
  const [value, setValue] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  const submit = () => {
    const query = value.trim()
    if (!query || disabled) return
    onSubmit(query)
    setValue('')
  }

  const syncScroll = (scrollTop: number) => {
    if (overlayRef.current) overlayRef.current.scrollTop = scrollTop
  }

  return (
    <form
      className={`${panelClass} flex items-end gap-2 px-3 py-2.5 shadow-sm shadow-black/5 transition-colors focus-within:border-slate/40`}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      {/* Textarea real fica transparente (só o cursor aparece) sobre uma camada
          que desenha o mesmo texto com /comandos destacados — CSS grid empilha
          as duas na mesma célula, sem cálculo manual de altura. */}
      <div className={`grid min-w-0 flex-1 self-center ${disabled ? 'opacity-50' : ''}`}>
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 max-h-40 overflow-hidden whitespace-pre-wrap break-words px-1 py-1.5 text-sm leading-relaxed text-bone"
        >
          <CommandText text={value} />
          {value.endsWith('\n') ? '​' : null}
        </div>
        <textarea
          rows={1}
          value={value}
          disabled={disabled}
          placeholder="pergunte ao mono…"
          className="col-start-1 row-start-1 max-h-40 w-full resize-none bg-transparent px-1 py-1.5 text-sm leading-relaxed text-transparent caret-bone placeholder:text-slate/60 focus:outline-none"
          onChange={(e) => {
            setValue(e.target.value)
            syncScroll(e.target.scrollTop)
          }}
          onScroll={(e) => syncScroll(e.currentTarget.scrollTop)}
          onKeyDown={(e) => {
            // Enter envia; Shift+Enter quebra linha
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        aria-label="enviar"
        disabled={disabled || !value.trim()}
        className="group relative h-8 shrink-0 overflow-hidden pl-3.5 pr-1"
      >
        <span className="mr-6 font-display text-[10px] font-medium uppercase tracking-[0.18em] transition-opacity duration-300 group-hover:opacity-0">
          enviar
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-y-1 right-1 z-10 grid w-6 place-items-center rounded-[2px] bg-ground/20 transition-all duration-300 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 19V5M12 5l-6 6M12 5l6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Button>
    </form>
  )
}
