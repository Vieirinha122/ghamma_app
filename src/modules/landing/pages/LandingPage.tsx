// Landing 2.0 — reconstruída a partir da referência visual aprovada (Stitch),
// filtrada por no-ai-slop: copy específica de vôlei, glow dosado, logo real,
// fonte do nosso sistema (Barlow Condensed + Manrope) e dados reais de atletas.
import { useState } from 'react'
import { GaleriaTeaser } from '../components/GaleriaTeaser'
import { AtletasTeaser } from '../components/AtletasTeaser'
import { CabecalhoPublico } from '../components/CabecalhoPublico'
// WhatsApp oficial do CT, com DDI e apenas dígitos.
const WHATSAPP_NUMERO = '5581994602680'

const barraMagenta = <span className="block h-1.5 w-12 -skew-x-[18deg] rounded-sm bg-lp-magenta" aria-hidden="true" />

const IconeSeta = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1">
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
  </svg>
)

const IconeCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" className="h-5 w-5">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
  </svg>
)

const IconeWhatsApp = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
  </svg>
)

export function LandingPage() {
  return (
    <div className="min-h-svh bg-lp-paper font-sans text-brand-ink">
      <CabecalhoPublico />
      <main>
        <Hero />
        <Metodologia />
        <Evolucao />
        <Publico />
        <GaleriaTeaser />
        <AtletasTeaser />
        <ContatoWhatsApp />
      </main>
      <Rodape />
    </div>
  )
}

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden bg-[radial-gradient(circle_at_0%_0%,rgba(195,49,210,0.15),transparent_28%),radial-gradient(circle_at_75%_75%,rgba(0,199,208,0.1),transparent_30%),linear-gradient(125deg,#080426_0%,#26104f_55%,#00596f_100%)] pb-20 pt-32 text-white"
    >
      <div className="relative z-10 mx-auto grid w-[min(calc(100%-40px),1180px)] grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="flex flex-col items-start lg:col-span-7">
          <h1 className="mb-6 mt-6 max-w-[700px] font-display text-[clamp(3.6rem,9vw,7rem)] font-black uppercase leading-[0.82] tracking-[-0.02em]">
            Aqui, cada bola importa.
            {/* risco magenta inclinado (assinatura visual do herói) */}
            <span className="mt-[0.16em] block h-[0.13em] w-[58%] -skew-x-[18deg] bg-lp-magenta" aria-hidden="true" />
          </h1>
          <p className="mb-8 max-w-[60ch] text-lg font-medium leading-relaxed text-[#e5ddec] sm:text-xl">
            Fundamentos, preparo físico e leitura de jogo para quem quer jogar melhor,
            começando do nível em que está.
          </p>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
            <a
              className="group inline-flex items-center justify-center rounded-xl bg-lp-cyan px-8 py-4 text-base font-extrabold tracking-wide text-brand-ink transition-all hover:brightness-110 active:scale-95"
              href="#contato"
            >
              Quero fazer uma aula experimental
              <IconeSeta />
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-8 py-4 text-base font-bold text-white transition-all hover:border-white hover:bg-white/10"
              href="#metodologia"
            >
              Conhecer o treinamento
            </a>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lp-cyan">
            <span className="h-2 w-2 rounded-full bg-lp-cyan" aria-hidden="true" />
            <span>CT Ghamma Volley · Juntas pelo Vôlei!</span>
          </div>
        </div>

        <div className="flex items-center justify-center py-12 lg:col-span-5">
          <div className="relative flex h-[440px] w-[380px] items-center justify-center sm:w-[460px]">
            {/* anéis orbitais elípticos com glow */}
            <div
              className="pointer-events-none absolute h-[340px] w-[460px] -rotate-12 rounded-[50%] border-2 border-lp-magenta/70 opacity-80 shadow-[0_0_30px_rgba(195,49,210,0.25)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute h-[320px] w-[440px] rotate-12 rounded-[50%] border-2 border-lp-cyan/80 opacity-90 shadow-[0_0_30px_rgba(0,199,208,0.25)]"
              aria-hidden="true"
            />
            {/* logo real da marca (asset fechado) */}
            <img
              src="/ghamma-logo.webp"
              alt="Ghamma Vôlei — Escolinha de Vôlei"
              width="1212"
              height="1073"
              fetchPriority="high"
              className="relative z-10 h-auto w-[min(100%,400px)] brightness-110 drop-shadow-[0_24px_28px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Metodologia ─────────────────────────────────────────────────────────────
function Metodologia() {
  const blocos = [
    {
      numero: '01 / Fundamento',
      titulo: 'Fundamento bem feito',
      texto:
        'Postura, ponto de contato e direção da bola em cada repetição de manchete, toque, saque e ataque.',
    },
    {
      numero: '02 / Preparo',
      titulo: 'Corpo pronto para a jogada',
      texto:
        'Deslocamento, impulsão e reação para chegar inteiro na bola e voltar rápido para a posição.',
    },
    {
      numero: '03 / Tática',
      titulo: 'Ler antes de decidir',
      texto:
        'Identifique o bloqueio, veja os espaços da defesa e escolha a jogada com mais segurança.',
    },
    {
      numero: '04 / Time',
      titulo: 'Treino com ritmo de jogo',
      texto:
        'Saque, recepção, transição e disputa de ponto em exercícios que cobram comunicação e decisão.',
    },
  ]

  return (
    <section id="metodologia" className="scroll-mt-20 bg-lp-paper py-16 text-brand-ink sm:py-20 lg:py-24">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:col-span-5">
            {barraMagenta}
            <h2 className="mb-6 mt-4 font-display text-[clamp(2.6rem,5vw,4rem)] font-black uppercase leading-[1.02] tracking-[-0.02em]">
              Treino com intenção em cada toque.
            </h2>
            <p className="text-lg font-medium leading-relaxed text-[#6a6074]">
              A gente corrige o movimento, repete com objetivo e leva o fundamento
              para situações de jogo.
            </p>
            <div className="mt-8 rounded-2xl border border-[#ded6e5] bg-white p-6 shadow-sm">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">Foco de treino</span>
              <p className="mt-1 font-bold">Exercícios com bastante contato com a bola.</p>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            {blocos.map((bloco) => (
              <article
                key={bloco.numero}
                className="rounded-2xl border border-[#ded6e5] bg-white p-8 shadow-sm transition-all hover:border-primary/40"
              >
                <span className="text-sm font-extrabold uppercase tracking-widest text-primary">{bloco.numero}</span>
                <h3 className="mb-3 mt-2 text-2xl font-bold">{bloco.titulo}</h3>
                <p className="leading-relaxed text-[#6a6074]">{bloco.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Evolução ────────────────────────────────────────────────────────────────
function Evolucao() {
  const etapas = [
    {
      numero: '1',
      fase: 'Fase inicial',
      titulo: 'Domínio dos fundamentos',
      texto:
        'Acerte a postura, o ponto de contato e a direção da bola nos fundamentos básicos.',
      circulo: 'bg-lp-cyan text-brand-ink',
    },
    {
      numero: '2',
      fase: 'Consolidação',
      titulo: 'Ritmo e consistência',
      texto:
        'Conecte recepção, levantamento e ataque até o movimento ficar mais seguro e constante.',
      circulo: 'bg-lp-magenta text-white',
    },
    {
      numero: '3',
      fase: 'Alto rendimento',
      titulo: 'Decisão em jogo',
      texto:
        'Treine situações de jogo, leia a quadra e escolha melhor quando o ponto aperta.',
      circulo: 'bg-white text-brand-ink',
    },
  ]

  return (
    <section id="evolucao" className="relative scroll-mt-20 overflow-hidden bg-[radial-gradient(circle_at_100%_25%,rgba(195,49,210,0.12),transparent_25%),radial-gradient(circle_at_0%_75%,rgba(0,199,208,0.12),transparent_25%),linear-gradient(180deg,#180a33,#0c051d)] py-16 text-white sm:py-20 lg:py-24">
      <div className="relative z-10 mx-auto w-[min(calc(100%-40px),1180px)]">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-20">
          <div className="mb-4 flex justify-center">{barraMagenta}</div>
          <h2 className="mb-4 font-display text-[clamp(2.6rem,5vw,4rem)] font-black uppercase leading-[1.02] tracking-[-0.02em]">
            Da primeira manchete ao jogo valendo.
          </h2>
          <p className="text-lg font-medium text-purple-200">
            Você aprende a base, ganha constância e passa a decidir melhor dentro da quadra.
          </p>
        </div>

        <div className="relative">
          {/* linha da timeline (desktop) */}
          <div
            className="absolute left-[15%] right-[15%] top-[38px] hidden h-1 rounded-full bg-[linear-gradient(90deg,#00c7d0,#c331d2,#ffffff)] opacity-70 md:block"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 gap-9 md:grid-cols-3 md:gap-10">
            {etapas.map((etapa, indice) => (
              <div key={etapa.numero} className="group relative grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-4 text-left md:flex md:flex-col md:items-center md:gap-0 md:text-center">
                {indice < etapas.length - 1 ? (
                  <div
                    className={`absolute -bottom-16 left-[26px] top-7 z-0 w-1 opacity-70 md:hidden ${
                      indice === 0
                        ? 'bg-[linear-gradient(180deg,#00c7d0,#c331d2)]'
                        : 'bg-[linear-gradient(180deg,#c331d2,#ffffff)]'
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
                <div
                  className={`z-10 flex h-14 w-14 items-center justify-center rounded-full font-display text-xl font-black transition-transform group-hover:scale-105 md:mb-6 md:h-20 md:w-20 md:text-2xl md:group-hover:scale-110 ${etapa.circulo} ${
                    etapa.numero === '1'
                      ? 'shadow-[0_0_30px_rgba(0,199,208,0.35)]'
                      : etapa.numero === '2'
                        ? 'shadow-[0_0_30px_rgba(195,49,210,0.35)]'
                        : 'shadow-[0_0_25px_rgba(255,255,255,0.35)]'
                  }`}
                >
                  {etapa.numero}
                </div>
                <div className="pt-0.5 md:pt-0">
                  <span className={`mb-2 block text-xs font-bold uppercase tracking-wider ${etapa.numero === '3' ? 'text-cyan-300' : etapa.numero === '2' ? 'text-lp-magenta' : 'text-lp-cyan'}`}>
                    {etapa.fase}
                  </span>
                  <h3 className="mb-2 text-xl font-bold md:mb-3 md:text-2xl">{etapa.titulo}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-gray-300">{etapa.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Público ─────────────────────────────────────────────────────────────────
function Publico() {
  const ganhos = [
    {
      titulo: 'Aprender os fundamentos sem pular etapa',
      texto: 'A comissão explica o movimento e corrige durante o exercício.',
    },
    {
      titulo: 'Corrigir postura corporal, impulsão e tempo de ataque',
      texto: 'Exercícios para chegar melhor na bola, saltar e atacar com segurança.',
    },
    {
      titulo: 'Ganhar confiança para pedir a bola',
      texto: 'Treine comunicação, posicionamento e decisão em situações de jogo.',
    },
    {
      titulo: 'Treinar com gente que leva o jogo a sério',
      texto: 'Turmas mistas, cobrança na medida e parceria dentro da quadra.',
    },
  ]

  return (
    <section className="bg-lp-paper py-16 text-brand-ink sm:py-20 lg:py-24">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {barraMagenta}
            <h2 className="mb-6 mt-4 font-display text-[clamp(2.6rem,5vw,4rem)] font-black uppercase leading-[1.02] tracking-[-0.02em]">
              Nossa força é jogar juntos.
            </h2>
            <p className="text-lg leading-relaxed text-[#6a6074]">
              Você pode estar começando agora, voltando a treinar ou buscando mais ritmo.
              A turma e os exercícios acompanham o seu nível.
            </p>
          </div>
          <div className="space-y-4 lg:col-span-7">
            {ganhos.map((ganho) => (
              <div
                key={ganho.titulo}
                className="flex items-start gap-4 rounded-2xl border border-[#ded6e5] bg-white p-5 shadow-sm"
              >
                <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconeCheck />
                </div>
                <div>
                  <h4 className="text-base font-bold">{ganho.titulo}</h4>
                  <p className="mt-1 text-sm text-[#6a6074]">{ganho.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Contato via WhatsApp ────────────────────────────────────────────────────
function ContatoWhatsApp() {
  const [nome, setNome] = useState('')

  // a conversa já abre com a mensagem pronta; o nome entra se a pessoa preencher
  const mensagem = nome.trim()
    ? `Oi, me chamo ${nome.trim()} e gostaria de fazer uma aula experimental.`
    : 'Oi, gostaria de fazer uma aula experimental.'
  const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`

  const confianca = [
    {
      titulo: 'Primeira aula gratuita',
      texto: 'Vem conhecer a quadra e o grupo sem pagar nada.',
      icone: <IconeCheck />,
    },
    {
      titulo: 'Fale direto com a equipe',
      texto: 'A comissão técnica acompanha o WhatsApp do CT.',
      icone: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <path d="M12 7v5l3 3" strokeLinecap="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      titulo: 'Sem compromisso',
      texto: 'Se curtir, a gente te encaixa na turma do seu nível.',
      icone: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
  ]

  return (
    <section id="contato" className="relative scroll-mt-20 overflow-hidden bg-[radial-gradient(circle_at_100%_10%,rgba(0,199,208,0.1),transparent_28%),linear-gradient(135deg,#12062e,#210947_60%,#0a031c)] py-16 text-white sm:py-20 lg:py-24">
      <div className="relative z-10 mx-auto grid w-[min(calc(100%-40px),1180px)] grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* argumentação: por que chamar */}
        <div>
          {barraMagenta}
          <h2 className="mb-5 mt-4 font-display text-[clamp(2.4rem,4.5vw,3.6rem)] font-black uppercase leading-[1.02] tracking-[-0.02em]">
            Vem conhecer o treino.
          </h2>
          <p className="mb-8 max-w-xl text-base font-medium leading-relaxed text-purple-200 sm:text-lg">
            Chame a equipe no WhatsApp. A gente pergunta seu nível, indica a turma
            e combina o melhor horário.
          </p>
          <div className="space-y-4">
            {confianca.map((item) => (
              <div key={item.titulo} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-lp-cyan/15 text-lp-cyan">
                  {item.icone}
                </div>
                <div>
                  <h4 className="font-bold">{item.titulo}</h4>
                  <p className="text-sm text-purple-200">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA direto: abre o WhatsApp do CT, identificando quem chama */}
        <div className="rounded-3xl border-2 border-lp-cyan/30 bg-[#1d0b3d]/80 p-8 text-center shadow-2xl sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#25D366]">
            <IconeWhatsApp className="h-10 w-10" />
          </div>
          <h3 className="font-display text-2xl font-black uppercase tracking-[-0.01em]">
            Fale com a comissão técnica
          </h3>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-purple-200">
            Deixe seu nome e chame no WhatsApp — a mensagem já sai pronta, pedindo
            a aula experimental.
          </p>
          <div className="mx-auto mt-6 max-w-sm">
            <label className="mb-1.5 block text-left text-xs font-bold uppercase tracking-wider text-purple-200" htmlFor="contato-nome">
              Seu nome ou apelido
            </label>
            <input
              id="contato-nome"
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              placeholder="Como te chamamos na quadra?"
              className="w-full rounded-xl border border-purple-400/30 bg-[#170a36] px-4 py-3 text-sm text-white outline-none placeholder-purple-300/40 focus:ring-2 focus:ring-lp-cyan"
            />
          </div>
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-8 py-4 text-base font-extrabold tracking-wide text-[#0b2e13] transition-all hover:brightness-110 active:scale-[0.99]"
          >
            <IconeWhatsApp className="h-6 w-6" />
            <span>Chamar no WhatsApp</span>
          </a>
          <p className="mt-4 text-xs text-purple-300/70">
            A conversa já abre com a mensagem pronta. Sem cadastro, sem burocracia.
          </p>
        </div>
      </div>
    </section>
  )
}

// ── Rodapé ──────────────────────────────────────────────────────────────────
function Rodape() {
  return (
    <footer className="border-t border-purple-950 bg-[#05021a] py-16 text-gray-400">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.1fr_0.9fr_1.4fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <img src="/ghamma-logo.webp" alt="Ghamma Vôlei" width="1212" height="1073" loading="lazy" className="mb-4 w-20" />
            <p className="text-sm font-medium leading-relaxed">
              CT Ghamma Volley · A rede nos une.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Navegação</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a className="transition-colors hover:text-lp-cyan" href="#metodologia">Metodologia de treino</a></li>
              <li><a className="transition-colors hover:text-lp-cyan" href="/galeria">Galeria de fotos</a></li>
              <li><a className="transition-colors hover:text-lp-cyan" href="/atletas">Quadro de atletas</a></li>
              <li><a className="transition-colors hover:text-lp-cyan" href="#contato">Aula experimental</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Conexões</h4>
            <ul className="space-y-2 break-words text-xs sm:text-sm">
              <li><a className="transition-colors hover:text-lp-magenta" href="https://www.instagram.com/ctghammavolley/" target="_blank" rel="noopener noreferrer">Instagram @ctghammavolley</a></li>
              <li><a className="transition-colors hover:text-lp-cyan" href="#contato">WhatsApp oficial do CT</a></li>
              <li>
                <address className="max-w-[34ch] not-italic leading-relaxed">
                  <a
                    className="transition-colors hover:text-lp-cyan hover:underline hover:underline-offset-4"
                    href="https://www.google.com/maps/search/?api=1&query=Tv.%20Ant%C3%B4nio%20Matoso%2C%2034%20A%20-%20Santo%20Aleixo%2C%20Jaboat%C3%A3o%20dos%20Guararapes%20-%20PE%2C%2054140-541"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tv. Antônio Matoso, 34 A - Santo Aleixo, Jaboatão dos Guararapes - PE, 54140-541
                  </a>
                </address>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-purple-950/80 pt-8 text-xs">
          <p>© 2026 CT Ghamma Volley · Juntas pelo Vôlei!</p>
        </div>
      </div>
    </footer>
  )
}
