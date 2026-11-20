// Teaser do elenco na landing: 6 cards de amostra. A lista completa com
// busca e filtro mora na rota /atletas (divulgação progressiva).
import { useBasePublica } from '../hooks/useAtletasPublicos'

export function AtletasTeaser() {
  const base = useBasePublica()
  const atletas = (base.data?.atletas ?? []).slice(0, 6)

  // sem atletas marcados: a amostra não aparece (landing não exibe vitrine vazia)
  if (base.isPending || atletas.length === 0) {
    return null
  }

  return (
    <section className="border-t border-[#ddd5e4]/70 bg-white py-24 text-brand-ink">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 block h-1.5 w-12 -skew-x-[18deg] rounded-sm bg-lp-magenta" aria-hidden="true" />
            <h2 className="font-display text-[clamp(2.6rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.02em]">
              Atletas do Ghamma.
            </h2>
            <p className="mt-4 max-w-[66ch] text-[1.04rem] leading-relaxed text-[#6a6074]">
              Quem treina, compete e veste a camisa toda semana.
            </p>
          </div>
          <a
            href="/atletas"
            className="inline-flex items-center justify-center rounded-xl border border-[#ded6e5] bg-white px-6 py-3 text-sm font-bold text-brand-ink transition-all hover:border-primary/50 hover:text-primary"
          >
            Ver todos os atletas
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {atletas.map((atleta) => (
            <article
              key={atleta.id}
              className="rounded-[18px] border border-[#ded6e5] bg-lp-paper p-5 shadow-sm transition-all hover:-translate-y-px hover:border-primary/50 hover:shadow-md"
            >
              <strong className="block text-xl font-extrabold tracking-tight">{atleta.nomeResumido}</strong>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-extrabold text-primary">
                  {atleta.idade ? `${atleta.idade} anos` : 'Idade não informada'}
                </span>
                <span className="inline-flex rounded-full border border-[#ded6e5] bg-white px-2.5 py-1 text-xs font-bold text-[#6a6074]">
                  {atleta.posicao || 'Posição livre'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
