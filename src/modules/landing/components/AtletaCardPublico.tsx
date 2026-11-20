import type { AtletaPublico } from '@/contracts/schemas/atletas'

interface AtletaCardPublicoProps {
  atleta: AtletaPublico
}

export function AtletaCardPublico({ atleta }: AtletaCardPublicoProps) {
  return (
    <article className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[#ded6e5] bg-lp-paper p-4 shadow-sm transition-[transform,border-color,box-shadow] hover:-translate-y-px hover:border-primary/50 hover:shadow-md sm:block sm:min-h-0 sm:p-5">
      <strong className="block min-w-0 text-lg font-extrabold leading-tight tracking-tight sm:text-xl">
        {atleta.nomeResumido}
      </strong>
      <div className="flex max-w-[9.75rem] flex-wrap items-center justify-end gap-1.5 sm:mt-3 sm:max-w-none sm:justify-start sm:gap-2">
        <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-[0.7rem] font-extrabold leading-none text-primary sm:text-xs">
          {atleta.idade ? `${atleta.idade} anos` : 'Idade não informada'}
        </span>
        <span className="inline-flex rounded-full border border-[#ded6e5] bg-white px-2.5 py-1 text-[0.7rem] font-bold leading-none text-[#6a6074] sm:text-xs">
          {atleta.posicao || 'Posição livre'}
        </span>
      </div>
    </article>
  )
}
