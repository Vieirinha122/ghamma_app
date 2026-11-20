import { useEffect, useRef, useState } from 'react'

const links = [
  ['Metodologia', '/#metodologia'],
  ['Evolução', '/#evolucao'],
  ['Galeria', '/galeria'],
  ['Atletas', '/atletas'],
  ['Contato', '/#contato'],
] as const

export function CabecalhoPublico() {
  const [menuAberto, setMenuAberto] = useState(false)
  const botaoFecharRef = useRef<HTMLButtonElement>(null)
  const linkBase = 'text-sm font-bold text-white! transition-colors hover:text-[#ee86f4]!'

  useEffect(() => {
    if (!menuAberto) return

    const overflowAnterior = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    botaoFecharRef.current?.focus()

    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setMenuAberto(false)
    }

    window.addEventListener('keydown', fecharComEscape)

    return () => {
      document.documentElement.style.overflow = overflowAnterior
      window.removeEventListener('keydown', fecharComEscape)
    }
  }, [menuAberto])

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[rgba(8,4,38,0.96)]">
      <div className="mx-auto flex h-20 w-[min(calc(100%-40px),1180px)] items-center justify-between gap-6">
        <a className="flex items-center" href="/#inicio" aria-label="Ghamma Volley — início">
          <img
            src="/ghamma-logo.webp"
            alt="Ghamma Vôlei"
            width="1212"
            height="1073"
            className="h-[60px] w-auto"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {links.map(([rotulo, destino]) => (
            <a key={destino} className={linkBase} href={destino}>
              {rotulo}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/#contato"
            className="hidden rounded-xl bg-lp-cyan px-5 py-2.5 text-sm font-extrabold text-brand-ink transition-[filter,transform] hover:brightness-110 active:scale-95 sm:inline-flex"
          >
            Aula experimental
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 text-white md:hidden"
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>

      {menuAberto ? (
        <div className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-[rgba(4,2,20,0.98)] pb-[env(safe-area-inset-bottom)] md:hidden" role="dialog" aria-modal="true" aria-label="Menu principal">
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-5 pt-[env(safe-area-inset-top)]">
            <a className="flex items-center" href="/#inicio" aria-label="Ghamma Volley — início" onClick={() => setMenuAberto(false)}>
              <img src="/ghamma-logo.webp" alt="" width="1212" height="1073" className="h-14 w-auto" />
            </a>
            <button
              ref={botaoFecharRef}
              type="button"
              className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-xl border border-white/25 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-cyan"
              aria-label="Fechar menu"
              onClick={() => setMenuAberto(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col px-5 pt-5" aria-label="Navegação principal (menu)">
            {links.map(([rotulo, destino]) => (
              <a
                key={destino}
                className="flex min-h-14 touch-manipulation items-center border-b border-white/10 py-3 font-display text-[1.7rem] font-black uppercase leading-none text-white! transition-colors hover:text-lp-cyan! focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lp-cyan"
                href={destino}
                onClick={() => setMenuAberto(false)}
              >
                {rotulo}
              </a>
            ))}
          </nav>

          <div className="px-5 pb-8 pt-7">
            <a
              href="/#contato"
              onClick={() => setMenuAberto(false)}
              className="flex min-h-14 touch-manipulation items-center justify-center rounded-xl bg-lp-cyan px-5 py-4 font-extrabold text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Aula experimental
            </a>
          </div>
        </div>
      ) : null}
    </header>
  )
}
