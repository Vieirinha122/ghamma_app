// Landing page — pública. Toda a UI em Tailwind com tokens do tema
// (lp-paper, lp-magenta, lp-cyan...) definidos no index.css.
// Os pseudo-elementos do CSS original viraram elementos reais (risco do h1,
// linha dos passos) — mesmo resultado, sem CSS fora do sistema.
import { SecaoAtletas } from '../components/SecaoAtletas'
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ml-2.5 w-5">
    <path
      d="M5 12h14M14 7l5 5-5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-6 flex-none text-primary">
    <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function LandingPage() {
  return (
    <div className="min-h-svh bg-lp-paper font-sans text-brand-ink">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/12 bg-[rgba(8,4,38,0.97)] text-white">
        <div className="mx-auto flex min-h-[82px] w-[min(calc(100%-40px),1180px)] items-center justify-between gap-7">
          <a className="block" href="#inicio" aria-label="Ghamma Volley — início">
            <img src="/ghamma-logo.png" alt="Ghamma Vôlei" className="block h-[68px] w-auto max-md:h-[62px]" />
          </a>
          <nav className="flex items-center gap-7" aria-label="Navegação principal">
            <a href="#metodologia" className="text-sm font-bold text-[#f8f3fa] hover:text-[#ee86f4] max-md:hidden">
              Metodologia
            </a>
            <a href="#evolucao" className="text-sm font-bold text-[#f8f3fa] hover:text-[#ee86f4] max-md:hidden">
              Evolução
            </a>
            <a
              href="#aula"
              className="rounded-[9px] bg-lp-cyan px-[18px] py-3 text-sm font-bold text-brand-ink hover:bg-[#67e7eb] max-md:text-[0.82rem]"
            >
              Aula experimental
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* hero */}
        <section
          id="inicio"
          className="grid min-h-svh items-center overflow-hidden bg-[linear-gradient(115deg,#080426_0_50%,#26104f_74%,#00596f_100%)] text-white"
        >
          <div className="mx-auto grid min-h-svh w-[min(calc(100%-40px),1180px)] grid-cols-1 items-center gap-3 pt-[130px] pb-[58px] md:grid-cols-[1.05fr_0.95fr] md:gap-[60px] md:pt-[118px]">
            <div className="relative z-2">
              <h1 className="m-0 max-w-[700px] font-display text-[clamp(4.5rem,9vw,8rem)] leading-[0.8] font-black tracking-[-0.03em] text-white text-balance uppercase">
                Seu jogo muda aqui.
                {/* risco magenta inclinado (era pseudo-elemento) */}
                <span className="mt-[0.16em] block h-[0.13em] w-[58%] -skew-x-[18deg] bg-lp-magenta" />
              </h1>
              <p className="mt-7 mb-[30px] max-w-[60ch] text-[1.06rem] leading-relaxed text-[#e5ddec]">
                Fundamentos, preparo físico e leitura de jogo para quem quer evoluir no vôlei,
                começando do próprio nível.
              </p>
              <div className="flex flex-col flex-wrap gap-3 sm:flex-row">
                <a
                  className="inline-flex min-h-[50px] items-center justify-center rounded-[9px] bg-lp-cyan px-5 py-3 font-extrabold text-brand-ink no-underline hover:bg-[#67e7eb] max-md:w-full"
                  href="#aula"
                >
                  Quero fazer uma aula experimental
                  <ArrowIcon />
                </a>
                <a
                  className="inline-flex min-h-[50px] items-center justify-center rounded-[9px] border border-white/38 px-5 py-3 font-extrabold text-white no-underline hover:border-lp-cyan hover:text-lp-cyan max-md:w-full"
                  href="#metodologia"
                >
                  Conhecer o treinamento
                </a>
              </div>
              <span className="mt-[22px] block text-[0.85rem] text-[#cbbfd5]">
                CT Ghamma Volley · Juntas pelo Vôlei!
              </span>
            </div>

            <div className="relative grid min-h-[420px] place-items-center md:min-h-[580px]" aria-label="Logo oficial do Ghamma Vôlei">
              <span className="absolute rounded-full rotate-[-10deg] border-2 border-[rgba(0,199,208,0.54)] inset-[20%_-15%_18%_0]" aria-hidden="true" />
              <span className="absolute rounded-full rotate-[-10deg] border-2 border-[rgba(195,49,210,0.48)] inset-[28%_-7%_25%_8%]" aria-hidden="true" />
              <img
                src="/ghamma-logo.png"
                alt="Ghamma Vôlei"
                className="relative z-2 w-[105%] max-w-none brightness-110 motion-safe:animate-entrada-logo md:w-[min(100%,550px)] md:[filter:brightness(1.1)_saturate(1.04)_drop-shadow(0_24px_28px_rgba(0,0,0,0.34))]"
              />
            </div>
          </div>
        </section>

        {/* pilares */}
        <section className="text-white bg-[linear-gradient(90deg,#32104f,#7018b8)]" aria-label="Focos do treinamento">
          <div className="mx-auto grid w-[min(calc(100%-40px),1180px)] grid-cols-1 md:grid-cols-3">
            <span className="grid min-h-[72px] place-items-center p-[22px] text-center font-display text-[1.3rem] font-extrabold border-b border-white/20 md:min-h-[104px] md:border-b-0 md:border-r">
              Fundamentos bem treinados
            </span>
            <span className="grid min-h-[72px] place-items-center p-[22px] text-center font-display text-[1.3rem] font-extrabold border-b border-white/20 md:min-h-[104px] md:border-b-0 md:border-r">
              Evolução no seu ritmo
            </span>
            <span className="grid min-h-[72px] place-items-center p-[22px] text-center font-display text-[1.3rem] font-extrabold md:min-h-[104px]">
              Time que cresce junto
            </span>
          </div>
        </section>

        {/* metodologia */}
        <section id="metodologia" className="py-[clamp(76px,10vw,128px)]">
          <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
            <div className="grid grid-cols-1 items-start gap-y-[clamp(50px,8vw,110px)] md:grid-cols-[0.82fr_1.18fr] md:gap-x-[clamp(50px,8vw,110px)]">
              <div className="md:sticky md:top-[120px]">
                <h2 className="m-0 max-w-[720px] font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] font-black tracking-[-0.03em] text-balance">
                  Mais intenção em cada toque.
                </h2>
                <p className="mt-6 max-w-[66ch] text-[1.04rem] leading-relaxed text-[#6a6074]">
                  Treinar é entender o movimento, ganhar confiança e levar a decisão certa para o jogo.
                </p>
              </div>
              <div className="border-t border-[#ddd5e4]">
                {[
                  ['Fundamentos e técnica', 'Passe, levantamento, ataque, bloqueio e defesa trabalhados com atenção à execução.'],
                  ['Desempenho em quadra', 'Agilidade, impulsão e condicionamento aplicados às exigências reais do voleibol.'],
                  ['Leitura e confiança', 'Exercícios que aproximam fundamento e jogo para melhorar reação e posicionamento.'],
                  ['Comunidade e união', 'Um ambiente acolhedor e competitivo, onde a evolução individual fortalece o time.'],
                ].map(([titulo, texto]) => (
                  <article key={titulo} className="border-b border-[#ddd5e4] py-[30px]">
                    <strong className="mb-2 block font-display text-[1.8rem] font-black">{titulo}</strong>
                    <p className="m-0 max-w-[62ch] text-[#6a6074]">{texto}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* evolução */}
        <section id="evolucao" className="bg-[linear-gradient(120deg,#080426,#231047_62%,#401060)] py-[clamp(76px,10vw,128px)] text-white">
          <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
            <h2 className="m-0 max-w-[720px] font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] font-black tracking-[-0.03em] text-balance">
              Da primeira manchete à confiança no jogo.
            </h2>
            <p className="mt-6 max-w-[66ch] text-[1.04rem] leading-relaxed text-[#d5cada]">
              A evolução acontece sem pular as etapas que sustentam cada jogada.
            </p>
            <div className="relative mt-[56px] grid grid-cols-1 gap-[34px] md:grid-cols-3 md:gap-[30px]">
              {/* linha das etapas: vertical no mobile, horizontal no desktop */}
              <div
                className="absolute top-7 bottom-7 left-7 w-0.5 bg-[linear-gradient(to_bottom,#00c7d0,#c331d2_50%,white)] md:hidden"
                aria-hidden="true"
              />
              <div
                className="absolute top-7 right-[3%] left-[3%] hidden h-0.5 bg-[linear-gradient(90deg,#00c7d0_0%,#c331d2_50%,white_83.33%,white_100%)] md:block"
                aria-hidden="true"
              />
              {[
                ['1', 'Comece pela base', 'Entenda posições, gestos e fundamentos essenciais.', 'bg-lp-cyan text-brand-ink'],
                ['2', 'Ganhe consistência', 'Corrija detalhes e transforme repetição em segurança.', 'bg-lp-magenta text-white'],
                ['3', 'Leve para a quadra', 'Conecte fundamento, leitura e decisão em situações de jogo.', 'bg-white text-brand-ink'],
              ].map(([numero, titulo, texto, corBadge]) => (
                <article key={numero} className="relative max-md:pl-20">
                  <span
                    className={`relative z-2 mb-6 grid h-[58px] w-[58px] place-items-center rounded-full font-black max-md:absolute max-md:left-0 max-md:top-0 max-md:mb-0 ${corBadge}`}
                  >
                    {numero}
                  </span>
                  <strong className="block font-display text-3xl font-black">{titulo}</strong>
                  <p className="mt-2 max-w-[34ch] text-[#d5cada]">{texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* público */}
        <section id="aula" className="py-[clamp(76px,10vw,128px)]">
          <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
            <div className="grid grid-cols-1 items-center gap-y-[clamp(50px,8vw,100px)] md:grid-cols-[0.9fr_1.1fr] md:gap-x-[clamp(50px,8vw,100px)]">
              <div>
                <h2 className="m-0 max-w-[720px] font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] font-black tracking-[-0.03em] text-balance">
                  Há espaço para o seu momento.
                </h2>
                <p className="mt-6 max-w-[66ch] text-[1.04rem] leading-relaxed text-[#6a6074]">
                  Você não precisa chegar pronta. Precisa chegar com vontade de aprender, retomar ou avançar.
                </p>
              </div>
              <ul className="m-0 list-none border-t border-[#ddd5e4] p-0">
                {[
                  'Aprender vôlei com uma base técnica clara',
                  'Corrigir fundamentos e ganhar consistência',
                  'Ter mais preparo e confiança para entrar em quadra',
                  'Evoluir em grupo e fortalecer o time',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3.5 border-b border-[#ddd5e4] py-5 font-bold">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* atletas do ghamma (público; some sozinha se não houver atletas marcados) */}
        <SecaoAtletas />
      </main>

      <footer className="bg-[#05021a] py-10 text-[#d9cee3]">
        <div className="mx-auto flex w-[min(calc(100%-40px),1180px)] flex-col items-center justify-center gap-[30px] min-h-[150px] md:flex-row md:items-center md:justify-between">
          <img src="/ghamma-logo.png" alt="Ghamma Vôlei" className="w-24" />
          <p className="m-0 text-[0.85rem]">CT Ghamma Volley · Juntas pelo Vôlei!</p>
        </div>
      </footer>
    </div>
  )
}



