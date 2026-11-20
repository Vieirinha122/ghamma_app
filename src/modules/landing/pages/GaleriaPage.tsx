// Página da galeria (rota /galeria): todas as fotos do CT em grade masonry
// (colunas CSS respeitam retrato/paisagem sem cortar). Fundo escuro para as
// fotos terem destaque.
import { CabecalhoPublico } from '../components/CabecalhoPublico'

const dimensoes = [
  [1200, 1600],
  [1200, 1600],
  [1200, 1600],
  [1600, 1200],
  [1200, 1600],
  [1200, 1600],
  [960, 1280],
  [1200, 1600],
  [960, 1280],
] as const

const FOTOS = dimensoes.map(([width, height], indice) => {
  const numero = String(indice + 1).padStart(2, '0')
  return { src: `/galeria/galeria-${numero}.jpg`, alt: `Treino do CT Ghamma Volley — foto ${indice + 1}`, width, height }
})

export function GaleriaPage() {
  return (
    <div className="min-h-svh bg-brand-ink pb-24 pt-20 text-white">
      <CabecalhoPublico />

      <section className="pt-16">
        <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
          <span className="mb-3 block h-1.5 w-12 -skew-x-[18deg] rounded-sm bg-lp-magenta" aria-hidden="true" />
          <h1 className="font-display text-[clamp(2.6rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.02em]">
            Galeria do Ghamma.
          </h1>
          <p className="mt-4 max-w-[66ch] text-[1.04rem] leading-relaxed text-[#cfc4d8]">
            Treino de quadra, areia, viagem e os dias que fazem o Ghamma acontecer.
          </p>

          {/* masonry: fotos de alturas diferentes fluem sem cortes */}
          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {FOTOS.map((foto) => (
              <figure key={foto.src} className="mb-4 break-inside-avoid">
                <img
                  src={foto.src}
                  alt={foto.alt}
                  width={foto.width}
                  height={foto.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-2xl border border-white/10 object-cover transition-transform hover:scale-[1.01]"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
