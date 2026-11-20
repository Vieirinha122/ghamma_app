// Teaser da galeria na landing: 4 fotos de amostra sobre fundo escuro.
// A galeria completa mora na rota /galeria (divulgação progressiva).

const AMOSTRA = [1, 2, 3, 4].map((n) => `/galeria/galeria-0${n}.jpg`)

export function GaleriaTeaser() {
  return (
    <section className="relative overflow-hidden bg-brand-ink py-16 text-white sm:py-20 lg:py-24">
      <div className="relative z-10 mx-auto w-[min(calc(100%-40px),1180px)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 block h-1.5 w-12 -skew-x-[18deg] rounded-sm bg-lp-magenta" aria-hidden="true" />
            <h2 className="font-display text-[clamp(2.6rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.02em]">
              Galeria do Ghamma.
            </h2>
            <p className="mt-4 max-w-[66ch] text-[1.04rem] leading-relaxed text-[#cfc4d8]">
              Treino de quadra, areia e os dias que fazem o Ghamma acontecer.
            </p>
          </div>
          <a
            href="/galeria"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:border-lp-cyan hover:text-lp-cyan"
          >
            Ver galeria completa
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-4">
          {AMOSTRA.map((src, indice) => (
            <a key={src} href="/galeria" className="group block overflow-hidden rounded-2xl border border-white/10">
              <img
                src={src}
                alt={`Bastidores do CT Ghamma Volley — foto ${indice + 1}`}
                width={indice === 3 ? 1600 : 1200}
                height={indice === 3 ? 1200 : 1600}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
